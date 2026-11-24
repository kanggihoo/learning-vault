# 한 번 로그인하면 어느 앱까지 열릴까
Lang: ko
Target: 두 앱에서 cookie 수신 범위를 그려 앱·중앙 로그아웃 뒤 재방문을 예측한다.

:::recap
[앞선 레슨](./0058-proxy-forward-auth-trust.html)에서는 **Traefik(리버스 프록시) + tinyauth(인증 서버) + `reports`(보호 앱)** 구조에서 쿠키가 인증 서버로 전달되는 흐름을 봤다. 이제 앱이 `reports`와 `dash` 두 개로 늘어나면 "한 번 로그인했을 때 두 앱이 모두 열리는 SSO"를 어떻게 만들까? 여기에는 0057~0058에서 본 **프록시 ForwardAuth 방식**과, 앱이 직접 중앙 로그인 서버와 대화하는 **OIDC 방식** 두 가지가 있다.
:::

:::key
한 번 로그인해 여러 앱을 여는 SSO(Single Sign-On) 경험은 두 가지 구조로 만들 수 있다. 첫째는 0057~0058에서 본 **프록시 ForwardAuth + 상위 도메인 쿠키 공유** 방식이고, 둘째는 리버스 프록시가 인증을 가로채지 않고 **중앙 인증 서버(OP)만 자기 쿠키를 갖고 각 앱(RP)이 자기만의 세션을 따로 만드는 OIDC 방식**이다. 두 구조는 **로그아웃했을 때 남는 세션 범위**가 완전히 다르다.
:::

:::terms
- Host-only 쿠키: 서버가 `Set-Cookie` 응답을 보낼 때 `Domain` 속성을 생략해 발급한 쿠키. 브라우저는 이 쿠키를 **발급해 준 정확한 호스트(예: `auth.example.com`)에만** 다시 전송하고, `reports.example.com` 같은 다른 하위 도메인에는 보내지 않는다.
- OP (OpenID Provider): OIDC 표준에서 중앙 로그인 서버를 부르는 말. 사용자 비밀번호를 확인해 로그인 세션을 들고 있고, 앱들에게 "이 사람 로그인했음"이라는 인증 결과를 발급한다. (예: OIDC 공급자로 동작하는 tinyauth, Google 로그인의 Google)
- RP (Relying Party): OIDC 표준에서 개별 서비스 앱(`reports`, `dash`)을 부르는 말. 로그인을 직접 처리하지 않고 OP의 인증 결과를 검증·신뢰(Rely)한 뒤, 자기 앱 전용 세션을 따로 발급해 관리한다.
:::

## Traefik과 tinyauth는 어디로 갔을까?

0057~0058에서는 Traefik(리버스 프록시)이 모든 요청을 가로채 tinyauth에 물어봤는데, 왜 이번 레슨에는 **OP**와 **RP**가 새로 등장할까? **리버스 프록시가 사라진 것이 아니라, SSO를 구현하는 두 번째 아키텍처(OIDC)가 추가되었기 때문**이다.

- **OP는 외부 로그인일 수도, 자체 IdP일 수도 있다**: 일반적인 백엔드에서 Google 로그인을 연동하면 Google이 OP, 내 백엔드가 RP다. 사내/자체 통합 인증을 구축할 때는 직접 띄운 자체 IdP(`auth.example.com`)가 OP가 된다. 결국 **여러 개의 RP(`reports`, `dash`)가 동일한 하나의 OP를 바라보고 각각 인증을 요청하는 1:N 구조**다.
- **리버스 프록시(Traefik)의 역할 변화**: OIDC 방식에서도 앞단에 Traefik 같은 리버스 프록시가 그대로 있을 수 있다. 다만 이때 Traefik은 매 요청 인증을 가로채지 않고 **도메인별 트래픽 전달(라우팅)과 HTTPS 처리만** 맡으며, 인증 요청과 검증은 각 RP가 OP와 직접 주고받는다.

:::compare SSO를 만드는 두 가지 방식
### 1. 상위 도메인 쿠키 공유 (Traefik + tinyauth ForwardAuth 방식)

0057~0058에서 다룬 구조 그대로다. `auth.example.com`(tinyauth)이 중앙 인증 쿠키를 `Domain=example.com`, `Path=/`로 발급한다. `Domain`을 상위 도메인으로 열어 두었기 때문에, 브라우저는 `reports.example.com`과 `dash.example.com`에 접속할 때도 같은 쿠키를 자동으로 실어 보낸다. 그러면 두 앱 앞단에 서 있는 **Traefik(리버스 프록시)**이 그 쿠키를 tinyauth에 넘겨 판정받는다. ([RFC 6265 쿠키 Domain 규칙](https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2.3))

### 2. 중앙 host-only 쿠키 + 앱별 독립 세션 (OIDC 방식)

여기서는 리버스 프록시가 인증 판정(ForwardAuth)을 대신하지 않고 단순 네트워크 라우팅만 담당하거나 생략된다. 대신 중앙 인증 서버가 **OP(`auth.example.com`)**, 각 앱이 **RP(`reports`, `dash`)** 역할을 맡는다. OP가 `Domain` 속성을 생략해 **host-only 쿠키**를 발급하므로, OP의 쿠키는 `auth.example.com`에만 전송되고 `reports`나 `dash`로는 넘어가지 않는다. 대신 `reports`와 `dash`는 각자 자기 호스트 전용 앱 세션을 따로 만든다. 처음 `dash`를 열면 브라우저가 OP로 이동하는데, OP에 이미 유효한 중앙 세션이 있으므로 비밀번호를 다시 묻지 않고 통과시켜 `dash`가 자기 세션을 만들 수 있게 해 준다. ([OIDC Core 인증 흐름](https://openid.net/specs/openid-connect-core-1_0.html#Authenticates))
:::

## 두 방식의 공통점, 차이점, 장단점

### 공통점
- 두 방식 모두 사용자는 중앙 로그인 페이지(`auth.example.com`)에서 **한 번만 로그인**하면 `reports`와 `dash`를 비밀번호 재입력 없이 이용할 수 있다.
- 실제 비밀번호 검증과 중앙 로그인 상태 관리는 모두 중앙 인증 서버가 맡는다.

### 차이점과 장단점

| 비교 항목 | 방식 1 · 상위 도메인 쿠키 공유 (ForwardAuth) | 방식 2 · 중앙 host-only 쿠키 + 앱별 세션 (OIDC) |
|---|---|---|
| 인증 확인 주체 | 앞단 프록시(Traefik)가 매 요청마다 인증 서버에 확인 후 `Remote-*` 헤더 전달 | 각 앱(RP)이 OIDC로 최초 인증 결과를 검증한 뒤 자체 세션으로 처리 |
| 쿠키 전송 범위 | `Domain=example.com`으로 모든 하위 도메인에 공유 | OP 쿠키는 `auth.example.com`에만, 각 앱은 자기 호스트 전용 세션 쿠키 사용 |
| 도메인 제약 | 같은 상위 도메인(`*.example.com`) 아래에서만 동작 | 서로 다른 도메인(`a.com`, `b.org`) 간에도 SSO 가능 |
| 장점 | 인증 기능이 없는 앱도 코드 수정 없이 빠르게 보호 가능. 중앙 세션을 끊으면 모든 앱 접근이 즉시 차단됨 | 표준 프로토콜(OIDC)로 외부 서비스 연동이 쉽고, 매 요청마다 중앙 인증 서버를 거치지 않아도 됨 |
| 단점 | 매 요청마다 인증 서브요청 비용이 들며, `Remote-*` 헤더 신뢰 경계 관리가 필수 | 각 앱이 OIDC 연동을 구현해야 하며, 별도 전파 없이는 중앙 로그아웃이 개별 앱 세션을 즉시 끊지 못함 |

:::iframe
[중앙 cookie를 써서 두 번째 앱의 세션을 만드는 흐름](../figures/0059-central-sso-visit.html)
중앙 OP 쿠키가 어느 호스트로만 전송되는지, 그리고 `dash` 앱의 세션이 어느 시점에 새로 만들어지는지 화살표를 따라가 보자.
mode: archify
height: 700px
:::

## 쿠키가 어느 호스트까지 전송될까

여기서 **Domain**(`example.com`처럼 상위 이름 공간)과 **Host**(`auth.example.com`, `reports.example.com`처럼 실제 요청을 받는 개별 주소)를 구분해야 한다. OIDC 방식에서 OP는 **OP 자신의 호스트(`auth.example.com`) 전용(host-only)으로 중앙 로그인 쿠키를 굽고**, 이후 사용자가 직접 접속하든 다른 RP가 리다이렉트로 보내든 `auth.example.com`으로 요청이 가면 브라우저가 그 쿠키를 자동으로 실어 보낸다.

브라우저는 `Set-Cookie`의 `Domain` 속성 유무에 따라 쿠키를 보낼 호스트를 엄격하게 가른다. (HTTPS와 `Path=/` 조건을 모두 충족한다고 가정)

| `auth.example.com`이 설정한 쿠키 | `auth.example.com` | `reports.example.com` | `dash.example.com` |
|---|---|---|---|
| `Domain=example.com` | 전송 | 전송 | 전송 |
| `Domain` 생략 (host-only) | 전송 | — | — |

쿠키를 지울 때도 같은 격리 규칙이 적용된다.

- **서버(`Set-Cookie`)·JS(`document.cookie`)**: 반드시 발급한 정확한 호스트(`auth.example.com`)에서만 지울 수 있고, 지우려는 쿠키의 **이름·Domain·Path**가 발급 때와 정확히 일치해야 브라우저가 해당 항목을 제거한다. ([RFC 6265 저장과 전송 규칙](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.3))
- **브라우저 개발자 도구(DevTools → Application → Cookies)**: 현재 열려 있는 페이지와 그 페이지가 불러온 도메인의 쿠키만 보여준다. 따라서 `auth.example.com`에서 쿠키를 받은 뒤 `reports.example.com`이나 다른 사이트(`a.b.com`)로 이미 이동했다면, 그 페이지의 DevTools 목록에는 `auth.example.com` 쿠키가 보이지 않는다. 수동으로 지우려면 `auth.example.com`으로 다시 이동해 DevTools에서 삭제하거나, 크롬 설정(`chrome://settings/content/all`)에서 해당 호스트의 쿠키를 찾아 지워야 한다.

## 로그아웃했는데 왜 다른 앱은 안 풀릴까?

두 번째 구조(각 앱이 독립 세션을 유지하고 별도 로그아웃 전파 메커니즘이 없는 상태)에서는 "어디서 로그아웃했느냐"에 따라 재방문 결과가 전혀 달라진다. `reports`와 `dash`를 모두 열어 중앙 OP 세션과 두 앱의 세션이 모두 유효한 상태에서 시작해 보자.

| 종료한 세션 | `reports` 재방문 결과 | `dash` 재방문 결과 |
|---|---|---|
| `reports` 앱 세션만 종료 | 중앙 OP로 이동했다가, 살아 있는 OP 세션 덕분에 새 `reports` 세션을 자동 발급받음 | 기존 `dash` 세션 그대로 유지 |
| 중앙 OP 세션만 종료 | 기존 `reports` 세션 그대로 유지 | 기존 `dash` 세션 그대로 유지 |
| `reports` 세션 + 중앙 OP 세션 함께 종료 | 다시 아이디/비밀번호 인증 요청 | 기존 `dash` 세션 그대로 유지 |

:::example reports에서 로그아웃했는데 다시 열면 자동 로그인되는 이유
사용자가 `reports` 앱의 로그아웃 버튼을 눌러 `reports`의 앱 세션만 지웠다. 하지만 `auth.example.com`에 있는 중앙 OP 세션은 여전히 살아 있다. 사용자가 `reports`를 다시 열면 `reports`는 세션이 없으니 OP로 리다이렉트하고, OP는 "이미 로그인된 사용자"로 판단해 재인증 없이 인증 결과를 돌려준다. 결국 사용자는 로그아웃한 직후인데도 다시 로그인된 화면을 보게 된다. (앱과 중앙 세션을 함께 끊으려면 [OIDC RP-Initiated Logout](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout) 같은 연동이 필요하다.)
:::

:::note RP가 JWT(Access Token + Refresh Token)로 자체 세션을 관리하는 경우
RP가 자기 세션을 쿠키가 아닌 JWT로 관리할 때도 결론은 같다.
- **저장 위치**: JWT를 `localStorage`/메모리에 두고 `Authorization: Bearer` 헤더로 보내면 RP 호스트의 쿠키는 아예 없고, `HttpOnly` 쿠키에 JWT를 담아 쓰면 RP 호스트 전용 쿠키가 생긴다.
- **만료와 재인증**: RP의 Refresh Token(RT)까지 만료되면 RP는 사용자를 다시 OP(`auth.example.com`)로 보내 재인증을 요청한다. 이때 OP의 중앙 세션이 아직 살아 있으면 비밀번호를 다시 묻지 않고 새 인증 결과를 발급해 주며, OP 세션도 만료됐거나 중앙 로그아웃한 상태라면 다시 로그인을 요구한다. 반대로 RP의 JWT(AT/RT)가 아직 유효한 동안에는 중앙 OP에서 로그아웃해도 해당 RP의 로그인 상태는 그대로 유지된다.
:::

:::note
이 표와 시나리오는 RFC 6265 쿠키 규칙과 OIDC 표준 모델에 기반한 정리다. 실제 브라우저의 쿠키 저장·전송 결과는 구축 단계에서 두 테스트 호스트로 직접 확인한다.
:::

:::quiz
공유 쿠키(`Domain=example.com`)를 쓰고 두 앱 모두 매 요청마다 그 쿠키로 인증 서버 판정을 받는 구성이다. 브라우저 개발자 도구에서 해당 공유 쿠키를 삭제하면 다음 두 앱 요청은 어떻게 될까?
- [ ] `reports`만 공유 쿠키 없이 요청한다
  Feedback: 두 호스트가 같은 공유 쿠키 항목을 바라보고 있다. 브라우저에서 그 항목을 지우면 두 호스트 모두 쿠키를 보내지 못한다.
- [ ] 두 앱 모두 공유 쿠키를 계속 보낸다
  Feedback: 서버 DB에 세션이 남아 있더라도, 브라우저 저장소에서 쿠키가 지워졌기 때문에 요청에 실어 보낼 수 없다.
- [x] 두 앱 모두 공유 쿠키 없이 요청한다
  Feedback: 하나의 공유 쿠키가 두 호스트에 모두 전송되던 구조이므로, 브라우저에서 삭제하면 두 앱 요청 모두에서 즉시 빠진다.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[RFC 6265 §5.4 쿠키 전송 조건](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.4)에서 host-only 쿠키와 `Domain` 매칭 조건이 두 하위 호스트에 어떻게 적용되는지 읽어 보자.
:::

:::ask
Teach Session에서 `reports` 앱이 먼저 로그아웃한 뒤, 일정 시간이 지나 중앙 OP 세션도 만료되는 경우를 시간 순서대로 따라가 보자.
:::
