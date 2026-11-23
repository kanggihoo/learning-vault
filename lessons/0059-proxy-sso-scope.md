# 한 번 로그인하면 어느 앱까지 열릴까
Lang: ko
Target: 두 앱에서 cookie 수신 범위를 그려 앱·중앙 로그아웃 뒤 재방문을 예측한다.

:::recap
[앞선 레슨](./0058-proxy-forward-auth-trust.html)에서는 브라우저가 `reports` 호스트로 보낸 쿠키를 Traefik이 인증 서버에도 전달했다. 그렇다면 `reports`와 `dash`처럼 여러 앱이 있을 때, 브라우저가 어떤 기준으로 쿠키를 실어 보내고 로그인 상태가 어디까지 이어지는지 살펴보자.
:::

:::key
한 번 로그인해 여러 앱을 여는 SSO 경험은 두 가지 구조로 만들 수 있다. 하나는 상위 도메인 쿠키를 여러 앱이 함께 쓰는 방식이고, 다른 하나는 중앙 인증 서버(OP)만 자기 쿠키를 갖고 각 앱(RP)이 자기만의 세션을 따로 만드는 방식이다. 두 구조는 **로그아웃했을 때 남는 세션 범위**가 완전히 다르다.
:::

:::terms
- Host-only 쿠키: `Domain` 속성을 생략해 발급한 쿠키로, 오직 쿠키를 설정한 정확한 호스트에만 전송된다.
- OP (OpenID Provider): 중앙에서 사용자를 인증하고 로그인 상태와 인증 결과를 발급하는 서버.
- RP (Relying Party): 중앙 OP의 인증 결과를 검증해 받아들이고, 자기 서비스 세션을 관리하는 개별 앱.
:::

:::compare SSO를 만드는 두 가지 방식
### 1. 상위 도메인 쿠키 공유

`auth.example.com`에서 중앙 인증 쿠키를 `Domain=example.com`, `Path=/`로 발급한다. HTTPS 등 전송 조건이 맞으면 브라우저는 `reports.example.com`과 `dash.example.com`에 접속할 때도 같은 쿠키를 자동으로 보낸다. 두 앱 앞단의 프록시가 그 쿠키를 같은 인증 서버에 넘겨 판정받는 구조다. ([RFC 6265 쿠키 Domain 규칙](https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2.3))

### 2. 중앙 host-only 쿠키 + 앱별 독립 세션

중앙 OP가 `Domain`을 생략하면 중앙 쿠키는 `auth.example.com`에만 전송된다. 대신 `reports`와 `dash`는 각각 RP로서 자기 호스트 전용 앱 세션을 갖는다. 처음 `dash`를 열면 브라우저가 중앙 OP로 이동하는데, OP에 이미 유효한 중앙 세션이 있으므로 비밀번호를 다시 묻지 않고 통과시켜 `dash`가 자기 세션을 만들 수 있게 해 준다. ([OIDC Core 인증 흐름](https://openid.net/specs/openid-connect-core-1_0.html#Authenticates))
:::

:::iframe
[중앙 cookie를 써서 두 번째 앱의 세션을 만드는 흐름](../figures/0059-central-sso-visit.html)
중앙 OP 쿠키가 어느 호스트로만 전송되는지, 그리고 `dash` 앱의 세션이 어느 시점에 새로 만들어지는지 화살표를 따라가 보자.
mode: archify
height: 700px
:::

## 쿠키가 어느 호스트까지 전송될까

브라우저는 `Set-Cookie`의 `Domain` 속성 유무에 따라 쿠키를 보낼 호스트를 엄격하게 가른다. (HTTPS와 `Path=/` 조건을 모두 충족한다고 가정)

| `auth.example.com`이 설정한 쿠키 | `auth.example.com` | `reports.example.com` | `dash.example.com` |
|---|---|---|---|
| `Domain=example.com` | 전송 | 전송 | 전송 |
| `Domain` 생략 (host-only) | 전송 | — | — |

쿠키를 지울 때도 같은 규칙이 적용된다. 서버가 `Set-Cookie`로 특정 쿠키를 삭제하려면 지우려는 쿠키의 **이름·Domain·Path**가 정확히 일치해야 브라우저가 해당 항목을 제거한다. ([RFC 6265 저장과 전송 규칙](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.3))

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
