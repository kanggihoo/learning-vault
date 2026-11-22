# ForwardAuth 판정 뒤 누가 응답할까
Lang: ko
Target: 인증 서비스의 응답을 보고 별도 설정 없는 proxy에서 앱 도달 여부와 클라이언트 응답 주체를 예측한다.

:::recap
OAuth 로그인에서는 callback을 처리한 백엔드가 로그인 상태를 만들 수 있다. 이번에는 그 상태를 담은 cookie로 보호된 `/reports`를 열어 보자. [OAuth2 로그인 흐름](./0004-oauth2-login-flow-stateless-vs-session.html) · [OAuth2 치트시트](../reference/0002-oauth2-login-flow-cheatsheet.html)
:::

:::key
인증 서비스의 2xx에는 “원 요청을 진행해도 된다”는 의미가 있다. 허용된 뒤 reports 앱이 자기 응답을 만든다. [Traefik v3.6 ForwardAuth](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/)
:::

:::iframe
[브라우저에서 reports 앱까지 허용된 요청 추적](../figures/0057-forward-auth-request-flow.html)
세 개의 요청 화살표와 각 응답의 수신자를 짚자. 이 예측에서는 인증 서비스가 200을 보내고 브라우저가 앱의 404를 받는다.
mode: archify
height: 720px
:::

브라우저가 보내는 세션 cookie가 reports 호스트에 포함되고, Traefik이 `Cookie`와 `User-Agent`를 판정 요청에 전달한다고 가정한다. tinyauth는 cookie 값으로 세션을 조회하고 정책을 통과한 인증 사용자에게 200을 보낸다. [Traefik 전달 헤더와 필터](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/#configuration-options) · [tinyauth context_middleware.go:79–96,151–162 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L79-L96) · [세션 조회](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L151-L162) · [proxy_controller.go:188–287 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L188-L287)

:::steps
1. 브라우저가 원 요청을 보낸다. Traefik은 앱으로 넘기기 전에 별도 인증 서브요청을 보낸다.
2. 인증 서비스가 판정 응답을 돌려준다. proxy가 자기 계약에 따라 원 요청의 다음 단계를 정한다.
3. 허용 시 앱이 원 요청을 처리한다. 거부 시 proxy가 클라이언트에 응답하고 앱 도달은 0건이다.
:::

## 같은 판정 코드, 두 proxy의 계약

Traefik의 `ForwardAuth`와 Nginx의 `auth_request`를 기본 동작에서 비교한다.

| 인증 응답 | Traefik | Nginx |
|---|---|---|
| 2xx | 앱으로 진행, 앱 응답을 받음 | 앱으로 진행, 앱 응답을 받음 |
| 401 / 403 | 인증 서비스의 거부 응답 반환 | 같은 상태로 거부, 401의 `WWW-Authenticate` 전달 |
| 302 | 유효한 절대 `Location`과 302 반환, 앱 도달 0 | 서브요청 오류로 처리, 앱 도달 0 |

클라이언트가 `Location`을 따르면 해당 URL로 새 HTTP 요청을 보낸다. [Traefik forward.go:235–263,290–310 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L235-L310) · [Nginx auth_request 문서](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html) · [RFC 9110 §15.4.3](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.3)

:::quiz
파일 다운로드에서 인증 서비스는 204, 파일 앱은 파일이 없어 404를 반환한다. 두 기본 계약에서 클라이언트가 받을 코드는?
- [ ] 두 proxy에서 모두 204
  Feedback: 204는 허용 판정이므로 이후 파일 앱이 응답한다.
- [ ] Traefik에서는 204, Nginx에서는 404
  Feedback: 두 계약 모두 204를 포함한 2xx에서 원 요청을 진행시킨다.
- [x] 두 proxy에서 모두 404
  Feedback: 인증 서비스의 204는 앱에 도달하도록 한다. 파일 앱이 만든 404가 최종 응답이다.
:::

:::quiz
Nginx 기본 auth_request의 인증 서브요청이 로그인 주소가 든 302를 받았다. 원 요청은 어떻게 될까?
- [x] 서브요청 오류로 처리되어 앱에 도달하지 않는다
  Feedback: 기본 모듈은 2xx, 401, 403 이외의 상태를 오류로 처리한다. 로그인 이동에는 별도 동작이 필요하다.
- [ ] 브라우저가 로그인 주소로 이동하고 앱 도달은 0건이다
  Feedback: 유효한 Location을 돌려주는 Traefik의 흐름이다. 기본 auth_request는 이 302를 클라이언트에 전달하지 않는다.
- [ ] 앱으로 진행하고 앱이 로그인 이동 여부를 정한다
  Feedback: 302는 허용에 해당하는 2xx 범위 밖이다. 구성한 보호 앱의 handler까지 진행하지 않는다.
:::

## tinyauth에 `/reports` 접근을 물으면

보호 경로에서 IP 정책은 통과하고 세션 cookie만으로 로그인 상태를 확인하는 예다. `Chrome`이 들어 있는 `User-Agent`는 이 버전의 브라우저 분기로 들어가고, `curl/8.7.1`은 JSON 분기로 들어간다. `/api/auth/nginx`도 JSON 분기를 사용한다. [proxy_controller.go:41,356–369,637–648 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L41) · [응답 모드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L356-L369) · [분류](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L637-L648)

| 조건 | Traefik 경로의 tinyauth 판정 | 기본 Traefik의 클라이언트 응답 / 앱 도달 예측 |
|---|---|---|
| 미인증 | 브라우저 302 `/login`, 비브라우저 401 | 302 또는 401 / 0건 |
| 로그인했고 접근 허용 | 200 | reports 앱의 응답 / 1건 |
| 로그인했으나 권한 부족 | 브라우저 302 `/unauthorized`, 비브라우저 403 | 302 또는 403 / 0건 |

비브라우저 응답에서는 `x-tinyauth-location`이 목적지를 안내한다. 브라우저 예측에는 302를 따르는 동작이 포함되며, Nginx는 위 모듈 계약에 따라 상태를 처리한다. [proxy_controller.go:188–221,268–313 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L188-L221) · [허용과 로그인](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L268-L313)

:::reveal
로그인 후 /reports로 돌아오는 요청은 앞서 멈춘 요청과 어떤 관계일까?
미인증 때 `redirect_uri`에 원래 scheme·host·URI가 담긴다. TOTP가 남지 않은 일반 앱 로그인은 `/continue`로 이어진다. 거기서 이동하면 브라우저가 `/reports`를 새로 요청하므로 proxy가 새 판정을 조회한다. [proxy_controller.go:290–313 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L290-L313) · [login-page.tsx:125–140](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/pages/login-page.tsx#L125-L140) · [login-for.ts:6–18](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/lib/hooks/login-for.ts#L6-L18) · [continue-page.tsx:43–95](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/pages/continue-page.tsx#L43-L95)
:::

:::warn
복귀 화면은 URL 파싱과 HTTP(S) 조건을 검사한다. 신뢰 범위 밖 주소나 HTTPS→HTTP 이동은 경고를 켠 구성에서 사용자에게 계속할지 묻는다. 이 경우 사용자 선택으로 이동할 수 있다. [redirect-uri.ts:42–75,94–117 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/lib/hooks/redirect-uri.ts#L42-L117) · [continue-page.tsx:43–180](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/pages/continue-page.tsx#L43-L180)
:::

:::terms
- 원 요청: 클라이언트가 보호된 리소스를 얻기 위해 proxy에 보내는 요청.
- 인증 서브요청: 원 요청의 접근을 판정하기 위해 proxy가 추가로 보내는 요청.
- 판정 계약: 인증 응답을 받은 proxy가 원 요청의 허용·차단을 결정하는 규칙.
:::

표와 도식은 코드와 문서로 도출한 예측이다. 실제 proxy HTTP와 브라우저 이동은 구축 단계에서 확인한다.

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html) · [로그인 후 프론트 복귀](./0005-oauth2-cookie-state-and-frontend-return.html) · [프론트 인증 상태 복원](./0006-react-auth-bootstrap-after-oauth2.html) · [PKCE](./0007-oauth2-fragment-implicit-flow-pkce.html) · [ID Token 검증 기록](../learning-records/0004-oauth2-state-and-id-token-validation.md) · [OAuth2 최종 정리](../summaries/0001-oauth2-final-summary-and-learning-patterns.md)

:::source
[Traefik v3.6 ForwardAuth 문서](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/) 첫 문단의 2xx와 그 밖의 상태에서 요청을 누가 이어받는지 읽어 보자.
:::

:::ask
Teach Session에서 인증 204 뒤 앱 404가 오는 요청을 놓고, 각 응답이 어느 연결에서 끝나는지 함께 추적하자.
:::
