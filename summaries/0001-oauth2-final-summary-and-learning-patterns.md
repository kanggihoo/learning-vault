# OAuth2 로그인 흐름 최종 정리와 학습 패턴

이번 OAuth2 Teach Session의 핵심은 “구글 로그인”을 단순히 JWT를 받는 과정으로 보지 않고, 브라우저 redirect, Google authorization server, 우리 백엔드 callback, Google token endpoint, 우리 서비스용 AT/RT 발급, React 인증 상태 복원으로 나누어 이해하는 것이었다.

## 최종 멘탈 모델

구글 로그인은 보통 순수 OAuth2만이 아니라 OpenID Connect까지 포함된 로그인 흐름이다. OAuth2는 권한 위임 프레임워크이고, OpenID Connect의 `id_token`이 “이 사용자가 누구인지”를 백엔드가 확인하는 데 쓰인다.

가장 중요한 흐름은 다음이다.

```text
1. 브라우저 -> 우리 백엔드
   GET /login/google

2. 우리 백엔드 -> 브라우저
   Set-Cookie: oauth_state=...
   302 Location: https://accounts.google.com/...&state=...

3. 브라우저 -> Google authorization server
   사용자가 accounts.google.com에서 로그인/동의

4. Google -> 브라우저
   302 Location: https://api.our-service.com/oauth2/callback/google?code=...&state=...

5. 브라우저 -> 우리 백엔드 callback
   GET /oauth2/callback/google?code=...&state=...
   Cookie: oauth_state=...

6. 우리 백엔드
   state 검증
   code를 Google token endpoint로 서버 간 교환
   Google id_token 검증
   Google sub로 우리 회원 조회/가입
   우리 서비스용 AT/RT 발급

7. 우리 백엔드 -> 브라우저
   Set-Cookie: refresh_token=RT; HttpOnly; Secure; ...
   302 Location: https://our-frontend.com/

8. 브라우저 -> 프론트
   React 앱 로드

9. React 앱 시작 코드
   POST /auth/refresh
   Cookie: refresh_token=RT

10. 우리 백엔드 -> React
    200 OK
    { accessToken, user }

11. React
    accessToken과 user를 state/context에 저장
    헤더를 로그인 버튼에서 “사용자 환영/로그아웃” 상태로 변경
```

## 사용자가 헷갈렸던 지점과 보정된 이해

### 1. callback은 웹훅이 아니다

처음에는 Google이 우리 백엔드 callback 주소로 직접 인증 결과를 보내는 “웹훅”처럼 이해했다. 실제로는 사용자의 브라우저가 Google의 302 응답을 따라 우리 callback URL로 GET 요청을 보낸다.

```text
틀린 모델:
Google server -> 우리 backend callback

정확한 모델:
Google server -> 302 Location 응답 -> browser -> 우리 backend callback
```

OAuth2 callback을 볼 때는 항상 “누가 HTTP 요청을 보내는가?”를 먼저 확인해야 한다. 대부분의 redirect 구간에서 실제 요청 주체는 브라우저다.

### 2. accounts.google.com은 우리 화면이 아니다

`accounts.google.com`은 우리 프론트가 아니라 Google이 제공하는 로그인/동의 화면이다. 우리 백엔드가 사용자를 그 URL로 redirect하고, 사용자는 Google이 호스팅하는 화면에서 로그인한다.

### 3. code와 token의 위치가 다르다

Authorization Code Flow에서 브라우저가 callback으로 가져오는 것은 `access_token`이 아니라 `code`다.

```text
브라우저가 가져오는 것:
  /oauth2/callback/google?code=...&state=...

백엔드가 서버 간 요청으로 받는 것:
  Google access_token
  Google id_token
  경우에 따라 Google refresh_token
```

그 다음 우리 백엔드는 Google token을 그대로 우리 API 인증에 쓰지 않고, Google `id_token`을 검증한 뒤 우리 서비스용 AT/RT를 새로 발급한다.

### 4. Google id_token은 decode가 아니라 verify해야 한다

`id_token`은 JWT 형태라서 payload를 base64url decode할 수 있다. 하지만 decode만으로는 신뢰할 수 없다.

검증해야 할 것은 다음이다.

```text
signature:
  Google 공개키/JWKS로 서명 검증

iss:
  accounts.google.com 또는 https://accounts.google.com

aud:
  우리 Google OAuth Client ID

exp:
  만료 여부

nonce:
  nonce를 사용한 흐름이면 요청 시점의 nonce와 일치 여부
```

검증이 끝난 뒤에야 `sub`를 Google 사용자 고유 식별자로 사용한다. `email`은 변경될 수 있으므로 기본 식별자로 삼지 않는 것이 안전하다.

### 5. state는 로그인 토큰이 아니라 callback 검증값이다

`state`는 “이 callback이 내가 시작한 로그인 요청의 결과인가?”를 확인하는 값이다. OAuth callback CSRF 방어에 쓰인다.

서버 세션 방식:

```text
GET /login/google:
  state 생성
  session["oauth_state"] = state
  Google URL에 &state=state 포함

GET /callback?code=...&state=...:
  query state와 session state 비교
```

쿠키 기반 방식:

```text
GET /login/google 응답:
  Set-Cookie: oauth_state=abc123; HttpOnly; Secure; SameSite=Lax; Max-Age=300
  302 Location: https://accounts.google.com/...&state=abc123

GET /callback?code=...&state=abc123:
  Cookie: oauth_state=abc123

서버:
  query state == cookie oauth_state 비교
  검증 후 oauth_state 쿠키 삭제
```

중요한 점은 이 쿠키가 Google로 전송되는 것이 아니라 우리 백엔드 도메인 쿠키로 저장되었다가 우리 callback 요청에 다시 붙는다는 것이다.

### 6. 302 redirect 응답 body로 토큰을 읽는 구조가 아니다

OAuth callback 처리 후 우리 백엔드가 프론트로 이동시키려면 `200 OK` JSON 응답보다 `302 Location` 응답을 쓴다.

```http
HTTP/1.1 302 Found
Set-Cookie: refresh_token=RT; HttpOnly; Secure; SameSite=Lax
Location: https://our-frontend.com/
```

이 경우 프론트 앱이 callback 응답 body에서 토큰을 읽는 구조가 아니다. 브라우저는 `Set-Cookie`를 저장하고 `Location`으로 이동한다.

### 7. HttpOnly RT를 프론트가 직접 읽지 않는다

OAuth callback 후 프론트 홈으로 돌아왔을 때 React는 아직 로그인 여부를 모른다. `refresh_token` 쿠키는 HttpOnly라서 JavaScript가 읽을 수 없기 때문이다.

그래서 React 앱 시작 시 서버에 인증 상태를 물어본다.

```text
React app mount:
  POST /auth/refresh
  credentials: "include"

브라우저:
  refresh_token 쿠키 자동 첨부

백엔드:
  RT 검증
  성공 시 { accessToken, user } 응답

React:
  accessToken과 user를 state/context에 저장
  authenticated 상태로 UI 렌더링
```

즉 “프론트가 쿠키를 읽어서 로그인 여부를 아는 것”이 아니라 “서버가 쿠키를 검증한 결과를 프론트가 받아서 로그인 상태를 구성하는 것”이다.

### 8. React에서는 AuthProvider가 인증 상태의 기준점이 된다

React 기준으로는 `AuthProvider`가 앱 시작 시 `useEffect`에서 `/auth/refresh`를 호출하고, 성공하면 `status`, `accessToken`, `user`를 저장한다.

```jsx
const [status, setStatus] = useState("loading");
const [accessToken, setAccessToken] = useState(null);
const [user, setUser] = useState(null);

useEffect(() => {
  async function bootstrapAuth() {
    const response = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      setStatus("authenticated");
    } else {
      setStatus("anonymous");
    }
  }

  bootstrapAuth();
}, []);
```

헤더는 이 상태를 보고 분기한다.

```text
loading:
  인증 확인 중

authenticated:
  "{user.name}님 환영합니다"
  로그아웃 버튼

anonymous:
  로그인 버튼
```

### 9. 방식 A와 방식 B

방식 A는 callback에서 바로 RT 쿠키를 심고 프론트 홈으로 redirect하는 방식이다.

```text
callback:
  RT 쿠키 Set-Cookie
  302 Location: frontend home

frontend:
  앱 시작 시 /auth/refresh 호출
  AT와 user 확보
```

일반적인 SPA + 백엔드 로그인에서는 방식 A가 더 단순하고 흔하다.

방식 B는 callback에서 바로 최종 토큰을 주지 않고, 우리 백엔드가 만든 일회성 로그인 티켓을 프론트에 넘긴 뒤 `/auth/exchange`로 교환하는 방식이다.

```text
callback:
  login_ticket 생성
  302 Location: frontend /oauth/complete?ticket=...

frontend:
  POST /auth/exchange { ticket }

backend:
  ticket 검증
  AT 응답 body
  RT Set-Cookie
```

방식 B는 토큰 발급을 일반 API 응답으로 통제하기 좋지만, 티켓 만료, 1회 사용, 재사용 방지, URL 로그 노출 방지까지 관리해야 하므로 구현 부담이 있다.

### 10. #fragment와 implicit flow는 예전 토큰 직접 전달 방식이다

URL의 `#` 뒤쪽은 fragment다.

```text
https://our-frontend.com/callback#access_token=abc
```

fragment는 HTTP 요청으로 서버에 전송되지 않는다. 브라우저 안에 남고 프론트 JavaScript가 `window.location.hash`로 읽을 수 있다.

예전 implicit flow에서는 Google 같은 authorization server가 access token을 브라우저에 바로 넘겼다.

```text
Google -> browser:
  302 Location: https://our-frontend.com/callback#access_token=...
```

현대 권고에서는 access token을 authorization response에서 브라우저에 직접 주는 implicit flow를 피하고, authorization code flow + PKCE를 사용한다.

```text
현대 흐름:
  callback?code=...
  code + code_verifier를 token endpoint에서 교환
```

PKCE의 핵심은 authorization code를 훔친 사람이 임의로 token endpoint에서 토큰으로 바꾸지 못하게, 처음 요청자가 가진 `code_verifier`를 나중에 다시 증명하게 하는 것이다.

## 반복된 질문 패턴

이번 Teach Session에서 반복된 질문 패턴은 다음이었다.

1. “이 요청은 누가 보내는가?”
   대부분의 혼란은 Google server, browser, backend, frontend의 역할이 섞이면서 생겼다. 앞으로 인증 흐름은 항상 요청 주체와 응답 주체를 먼저 적어야 한다.

2. “redirect는 응답인가 요청인가?”
   redirect 자체는 3xx 응답이고, 그 안의 `Location`을 보고 브라우저가 새 GET 요청을 보낸다. OAuth2 흐름은 이 redirect chain을 따라가야 이해된다.

3. “토큰이 body에 있어야 하는가?”
   API 응답이면 body에 토큰을 담을 수 있지만, 302 redirect 응답은 프론트 앱이 일반 API 응답처럼 body를 읽는 구조가 아니다. redirect 기반 로그인에서는 쿠키, 이후 refresh API, 또는 일회성 exchange API가 필요하다.

4. “HttpOnly 쿠키를 못 읽는데 로그인 상태를 어떻게 아는가?”
   프론트가 쿠키를 읽는 것이 아니라 서버에 `/auth/refresh` 또는 `/me`를 호출하고, 서버 응답을 React state로 저장한다.

5. “JWT는 decode하면 되는가?”
   JWT는 decode와 verify가 다르다. Google `id_token`은 공개키 기반 서명 검증과 claim 검증 후에만 신뢰한다.

6. “서버 세션이 없으면 state를 어디에 저장하는가?”
   서버 세션 저장소 대신 임시 HttpOnly 쿠키 또는 서명/암호화된 `state` 자체를 쓸 수 있다. 핵심은 요청과 callback을 검증 가능하게 묶는 것이다.

## 앞으로의 학습 기준

OAuth2/OIDC를 구현하거나 디버깅할 때는 다음 순서로 그리면 된다.

```text
1. 브라우저가 어디로 이동하는가?
2. 각 redirect 응답의 Location은 무엇인가?
3. callback URL에는 code/state 중 무엇이 들어오는가?
4. state는 어디에 저장했고 무엇과 비교하는가?
5. Google token endpoint 호출은 누가 하는가?
6. Google id_token은 어떻게 검증하는가?
7. 우리 AT/RT는 언제 발급하는가?
8. RT는 쿠키인가 body인가?
9. 프론트는 어떻게 로그인 상태를 복원하는가?
10. 새로고침 후에도 인증 상태가 복원되는가?
```

이 순서로 보면 “OAuth2가 무슨 마법처럼 로그인시켜주는 것”이 아니라, 브라우저 redirect와 서버 검증 단계가 이어지는 HTTP 흐름으로 보인다.

## 관련 저장 자료

- [0004 - OAuth2 로그인 흐름: 세션 방식과 무상태 방식](../lessons/0004-oauth2-login-flow-stateless-vs-session.html)
- [0005 - OAuth2 state 쿠키와 프론트 복귀 흐름](../lessons/0005-oauth2-cookie-state-and-frontend-return.html)
- [0006 - React에서 OAuth2 로그인 후 인증 상태 복원하기](../lessons/0006-react-auth-bootstrap-after-oauth2.html)
- [0007 - OAuth2 fragment, implicit flow, PKCE 이해하기](../lessons/0007-oauth2-fragment-implicit-flow-pkce.html)
- [0002 - OAuth2 로그인 흐름 치트시트](../reference/0002-oauth2-login-flow-cheatsheet.html)
- [0003 - React 인증 상태 복원 치트시트](../reference/0003-react-auth-bootstrap-cheatsheet.html)

## 참고한 공식 자료

- [RFC 6749: OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636.html)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [Google: Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google: Verify the Google ID token on your server side](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [React: useEffect](https://react.dev/reference/react/useEffect)
- [React: createContext](https://react.dev/reference/react/createContext)
- [React: useContext](https://react.dev/reference/react/useContext)
- [MDN: Request credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
