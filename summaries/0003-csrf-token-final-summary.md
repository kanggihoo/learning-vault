# CSRF 토큰 최종 정리

이 문서는 CSRF 토큰을 “왜 등장했는가”, “왜 막을 수 있는가”, “SPA/API에서는 어떻게 쓰는가”, “CORS와 Origin 검증은 왜 별도인가”까지 한 번에 다시 볼 수 있도록 정리한 Topic Summary다.

관련 자료:
- [CSRF 토큰이 막는 문제와 실제 사용 흐름](../lessons/0010-csrf-token-attack-and-defense.html)
- [CSRF 토큰 치트시트](../reference/0005-csrf-token-cheatsheet.html)
- [CSRF 토큰 질문 기준점](../learning-records/0015-csrf-token-question-baseline.md)
- [CSRF와 CORS/Origin 검증 멘탈 모델](../learning-records/0016-csrf-cors-origin-mental-model.md)

## 1. 최종 멘탈 모델

CSRF는 “공격자가 사용자의 비밀번호나 쿠키 값을 훔치는 공격”이 아니다. 핵심은 이미 로그인된 사용자의 브라우저가, 공격자가 만든 페이지의 유도에 따라 피해 서버로 상태 변경 요청을 보내게 되는 것이다.

브라우저는 조건이 맞으면 요청 대상 도메인의 쿠키를 자동으로 붙인다. 그래서 사용자가 `bank.example`에 로그인한 상태에서 `evil.example`을 방문하면, 공격자 페이지가 아래 같은 요청을 유도할 수 있다.

```html
<form action="https://bank.example/transfer" method="POST">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="100000">
</form>
<script>document.querySelector("form").submit();</script>
```

서버가 쿠키만 보고 “인증된 사용자 요청”이라고 처리하면 문제가 된다. 쿠키는 사용자가 로그인되어 있음을 보여주지만, 사용자가 지금 이 상태 변경을 의도했는지는 보여주지 못한다.

CSRF 토큰은 여기에 “의도 증명”을 하나 더 붙인다.

```text
인증 쿠키 = 이 브라우저가 로그인된 사용자임을 보임
CSRF 토큰 = 이 요청이 정상 화면/정상 스크립트에서 출발했음을 보임
```

따라서 상태 변경 요청은 보통 다음 두 가지를 같이 만족해야 한다.

```text
Cookie: JSESSIONID=...
X-XSRF-TOKEN: 세션에 묶인 예측 불가능한 토큰
```

## 2. CSRF 토큰이 막는 방식

서버는 사용자 세션에 대응되는 예측 불가능한 CSRF 토큰을 만들고, 정상 페이지나 정상 프론트 앱이 읽을 수 있는 방식으로 전달한다. 이후 `POST`, `PUT`, `PATCH`, `DELETE` 같은 상태 변경 요청이 오면 서버는 요청의 토큰이 세션의 토큰과 일치하는지 비교한다.

```text
1. 서버가 토큰 생성
   session.csrfToken = RANDOM_123

2. 정상 프론트가 토큰 수신
   hidden input, JSON body, response header, XSRF-TOKEN cookie 등

3. 정상 프론트가 상태 변경 요청에 토큰 첨부
   X-XSRF-TOKEN: RANDOM_123

4. 서버 검증
   request token == session token 이면 처리
   아니면 403
```

공격자 페이지는 사용자의 쿠키 값을 직접 읽지 못한다. 그리고 일반적인 cross-site 상황에서는 피해 사이트의 HTML, JSON 응답, response header, 피해 도메인 쿠키도 마음대로 읽지 못한다. 그래서 공격자는 사용자의 세션에 묶인 올바른 CSRF 토큰을 알기 어렵다.

단, 공격자가 토큰을 읽을 수 있으면 CSRF 방어는 깨질 수 있다. 대표 원인은 XSS, URL query string 노출, 서버/프록시 로그 노출, 너무 넓은 CORS 허용, 탈취된 하위 도메인 신뢰다. CSRF 토큰은 XSS 방어를 대체하지 않는다.

## 3. 왜 request header에 담는가

SPA/API에서는 CSRF 토큰을 request body보다 custom header에 담는 패턴이 자주 나온다.

```http
X-XSRF-TOKEN: RANDOM_123
```

이유는 일반 HTML form이 custom header를 붙일 수 없기 때문이다. 공격자 페이지는 form 자동 제출로 쿠키가 붙은 요청을 서버에 보낼 수 있지만, `X-XSRF-TOKEN` 같은 header를 붙일 수는 없다.

공격자가 JavaScript `fetch`로 custom header를 붙이려고 하면 CORS preflight가 필요하다.

```js
fetch("https://api.example.com/profile", {
  method: "POST",
  credentials: "include",
  headers: {
    "X-XSRF-TOKEN": "..."
  }
});
```

서버가 공격자 origin과 해당 custom header를 CORS에서 허용하지 않으면, 브라우저는 실제 상태 변경 요청을 보내기 전에 차단한다. 그래서 custom header 방식은 “form 기반 CSRF”를 막는 데 강하다.

## 4. `/csrf` API가 공개되어도 왜 괜찮은가

`/csrf` 같은 토큰 발급 API는 외부에서 요청 자체를 보낼 수 있다. 중요한 차이는 “요청 가능”과 “응답 읽기 가능”이 다르다는 점이다.

공격자 페이지에서 아래 코드를 실행할 수는 있다.

```js
fetch("https://api.example.com/csrf", {
  credentials: "include"
});
```

하지만 서버가 `evil.example`을 CORS 허용하지 않으면 공격자 JavaScript는 응답 body나 response header를 읽을 수 없다. `Set-Cookie: XSRF-TOKEN=...`이 내려와도 그 쿠키는 `api.example.com` 쿠키이므로 `evil.example`의 JavaScript가 `document.cookie`로 읽지 못한다.

깨지는 설정은 이런 형태다.

```http
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true
```

이렇게 공격자 origin에 credential 포함 응답 읽기를 허용하면, 공격자가 `/csrf` 응답에서 토큰을 얻고 상태 변경 요청에 재사용할 수 있다. 따라서 `/csrf` API를 둘 때도 CORS 허용 origin은 실제 프론트 origin으로 좁혀야 한다.

## 5. 토큰은 어디에 담아 내려줘도 되는가

서버와 프론트가 계약을 맞추면 JSON body, response header, cookie, HTML meta tag, hidden input 모두 가능하다. 차이는 프론트에서 읽는 방식과 CORS 설정이다.

### JSON body

```json
{
  "headerName": "X-XSRF-TOKEN",
  "token": "RANDOM_123"
}
```

명시적이고 이해하기 쉽다. cross-origin이면 프론트가 body를 읽을 수 있도록 CORS가 정확해야 한다.

### Response header

```http
X-CSRF-TOKEN: RANDOM_123
```

본문 구조와 분리된다. cross-origin에서 프론트가 이 header를 읽어야 하면 `Access-Control-Expose-Headers`가 필요할 수 있다.

### Cookie

```http
Set-Cookie: XSRF-TOKEN=RANDOM_123; Secure; SameSite=Lax; Path=/
```

프레임워크 관례와 자동 저장에 유리하다. Spring Security의 `CookieCsrfTokenRepository`는 `XSRF-TOKEN` 쿠키와 `X-XSRF-TOKEN` header 관례를 제공한다.

여기서 CSRF 토큰 쿠키는 인증 쿠키가 아니다. 로그인 세션 쿠키는 `HttpOnly`로 JavaScript 접근을 막는 것이 중요하지만, CSRF 토큰 쿠키는 프론트 JavaScript가 읽어서 header로 되돌려 보내야 하므로 `HttpOnly=false`로 두는 경우가 있다.

```text
세션 쿠키:
  인증 권한을 증명
  HttpOnly 권장
  탈취되면 로그인 탈취

CSRF 토큰 쿠키:
  상태 변경 요청 검증용 값
  프론트가 읽어 header로 되돌려 보내기도 함
  XSS가 있으면 탈취될 수 있으므로 XSS 방어 필요
```

## 6. CORS만으로 충분하지 않은 이유

사용자가 마지막에 정리한 내용이 정확하다.

```text
CORS는 허용되지 않은 origin의 응답 읽기를 막을 수 있다.
하지만 HTML form 같은 simple request는 서버까지 도착할 수 있다.
상태 변경 API라면 서버가 응답을 돌려주기 전에 이미 변경 처리를 끝냈을 수 있다.
그래서 서버는 상태 변경 로직 실행 전에 Origin/Referer를 직접 검증해야 한다.
```

CORS는 주로 브라우저가 cross-origin JavaScript에게 응답을 읽게 해도 되는지, 그리고 custom header 요청을 허용할지 정한다. CSRF의 핵심 위험은 응답 읽기가 아니라 상태 변경 요청이 서버에 도착해 처리되는 것이다.

따라서 상태 변경 API는 다음처럼 서버 쪽 방어를 겹쳐야 한다.

```text
1. CSRF 토큰 검증
2. Origin 또는 Referer 검증
3. SameSite 쿠키 설정
4. 엄격한 CORS 허용 origin
5. 상태 변경을 GET으로 만들지 않기
```

## 7. 사용자의 이해 변화

처음에는 “CSRF 토큰을 header에 넣으라는데, 토큰은 언제 받고 공격자도 `/csrf`를 호출하면 되는 것 아닌가?”가 핵심 질문이었다. 여기서 보정된 점은 세 가지다.

첫째, `/csrf` API가 공개되어도 공격자 origin의 JavaScript가 응답을 읽을 수 있는 것은 아니다. 요청 도착과 응답 읽기는 다르다.

둘째, custom header는 단순 form 제출로 만들 수 없다. 공격자가 custom header를 붙이려면 CORS preflight를 통과해야 한다.

셋째, CORS는 응답 읽기와 custom header 허용을 다루는 브라우저 정책이지, 모든 cross-site 상태 변경 요청이 서버에 도착하지 못하게 하는 서버 권한 검증이 아니다. 그래서 서버 처리 전에 Origin/Referer 검증이 별도로 의미를 가진다.

## 8. 실무 체크리스트

- 쿠키 기반 로그인인가?
- 브라우저가 인증 쿠키를 자동으로 붙이는가?
- `POST`, `PUT`, `PATCH`, `DELETE` 같은 상태 변경 API가 있는가?
- 상태 변경을 `GET`으로 처리하는 endpoint가 없는가?
- 서버가 세션에 묶인 CSRF 토큰을 만들고 검증하는가?
- SPA라면 토큰 획득 흐름이 명확한가? 예: 앱 시작, 로그인 직후, 세션 복구 후 `GET /csrf`.
- CSRF 토큰 전달 방식이 프론트와 서버 사이에 계약되어 있는가? 예: JSON body, response header, `XSRF-TOKEN` cookie.
- 상태 변경 요청에 custom header가 붙는가? 예: `X-XSRF-TOKEN`.
- CORS 허용 origin이 실제 프론트 origin으로 좁혀져 있는가?
- `Access-Control-Allow-Credentials: true`와 wildcard origin을 같이 쓰려는 실수가 없는가?
- 서버가 상태 변경 처리 전에 `Origin` 또는 `Referer`를 검증하는가?
- 세션 쿠키는 `HttpOnly`, `Secure`, 적절한 `SameSite`를 갖는가?
- CSRF 토큰이 URL query string, 로그, 외부 referrer로 새지 않는가?
- XSS 방어가 별도로 준비되어 있는가?

## 9. 참고 기준

- [OWASP: Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN: Cross-site request forgery](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)
- [MDN: Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [Spring Security: Cross Site Request Forgery](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
