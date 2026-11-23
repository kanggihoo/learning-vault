# ForwardAuth 판정 뒤 누가 응답할까
Lang: ko
Target: 인증 서비스의 응답을 보고 별도 설정 없는 proxy에서 앱 도달 여부와 클라이언트 응답 주체를 예측한다.

:::recap
OAuth 로그인에서는 callback을 처리한 백엔드가 로그인 상태를 만들 수 있었다. 이번에는 그 로그인 상태가 담긴 쿠키를 들고 보호된 `/reports` 페이지를 열 때, 프록시와 인증 서버, 보호 앱이 누구 순서로 개입하는지 살펴보자. ([OAuth2 로그인 흐름](./0004-oauth2-login-flow-stateless-vs-session.html) · [OAuth2 치트시트](../reference/0002-oauth2-login-flow-cheatsheet.html))
:::

:::key
인증 서버가 돌려주는 `2xx`는 브라우저에게 보내는 최종 응답이 아니다. 프록시에게 "이 요청은 통과시켜도 좋다"고 알려주는 허가 신호일 뿐이며, 허가가 떨어지면 실제 응답(200이든 404든)은 보호 앱이 직접 만든다.
:::

:::terms
- 원래 요청: 브라우저나 클라이언트가 보호된 리소스를 얻기 위해 프록시에 보낸 최초 HTTP 요청.
- 인증 서브요청: 프록시가 원래 요청을 앱에 넘기기 전에, 통과 여부를 묻기 위해 인증 서버로 따로 보내는 확인 요청.
- 프록시 처리 규칙: 인증 서브요청의 상태 코드를 보고 원래 요청을 앱으로 넘길지, 프록시가 직접 차단할지 결정하는 규칙.
:::

:::iframe
[브라우저에서 reports 앱까지 허용된 요청 추적](../figures/0057-forward-auth-request-flow.html)
세 개의 화살표가 각각 어느 서버로 향하고, 최종 404 응답이 어디서 만들어지는지 따라가 보자.
mode: archify
height: 720px
:::

브라우저가 `reports` 호스트에 세션 쿠키를 실어 보내면, Traefik은 이 요청을 곧바로 앱에 넘기지 않고 `Cookie`와 `User-Agent` 헤더를 포함한 인증 서브요청을 tinyauth에 보낸다. tinyauth가 쿠키 값으로 세션을 조회해 정상 사용자로 확인하면 `200`을 돌려주고, 그제야 Traefik이 원래 요청을 `reports` 앱으로 전달한다. ([Traefik ForwardAuth 옵션](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/#configuration-options) · [tinyauth 세션 조회 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L79-L96))

:::steps 요청이 앱에 닿기까지의 3단계
1. 브라우저가 `/reports`로 원래 요청을 보내면, Traefik은 앱으로 넘기기 전에 tinyauth에 인증 서브요청을 먼저 보낸다.
2. tinyauth가 세션을 확인해 판정 상태 코드(`200`, `302`, `401`, `403` 등)를 돌려준다.
3. `2xx`로 허용되면 Traefik이 원래 요청을 앱에 넘겨 앱이 응답하고, 거부되면 Traefik이 클라이언트에게 바로 응답하므로 앱에는 요청이 한 건도 닿지 않는다.
:::

## 같은 판정 코드, Traefik과 Nginx는 다르게 처리한다

인증 서버가 같은 상태 코드를 돌려주더라도, 앞단 프록시가 Traefik(`ForwardAuth`)인지 Nginx(`auth_request`)인지에 따라 기본 동작이 달라진다. 특히 `302` 리다이렉트를 만났을 때 결과가 갈린다.

| 인증 응답 | Traefik (`ForwardAuth`) | Nginx (`auth_request`) |
|---|---|---|
| `2xx` | 앱으로 요청을 넘기고 앱의 응답을 반환 | 앱으로 요청을 넘기고 앱의 응답을 반환 |
| `401` / `403` | 인증 서버의 거부 응답을 그대로 반환 | 같은 상태 코드로 거부 (`401`이면 `WWW-Authenticate` 헤더 전달) |
| `302` | 유효한 절대 `Location` 헤더와 함께 `302`를 반환 (앱 도달 0건) | 서브요청 오류로 간주해 차단 (앱 도달 0건) |

`2xx`는 양쪽 모두 통과 신호이고, `401`/`403`은 양쪽 모두 거부 신호다. 차이는 `302`에서 난다. Traefik의 [ForwardAuth 구현](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L235-L310)은 인증 서버가 유효한 절대 `Location`을 실어 보낸 `302`를 브라우저에게 그대로 전달해 로그인 화면으로 보낸다. 반면 [Nginx auth_request 모듈](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html)은 기본적으로 `2xx`, `401`, `403`만 정상 판정으로 해석하고, `302`를 포함한 나머지 코드는 서브요청 오류(`500` 등)로 처리해 버린다.

## tinyauth는 브라우저와 API 클라이언트를 다르게 응답한다

tinyauth는 인증에 실패했을 때 요청자가 사람(브라우저)인지 프로그램(`curl` 등)인지에 따라 응답 형태를 바꾼다. 브라우저는 로그인 화면으로 보내야 하고, API 클라이언트는 JSON 에러를 받아야 다루기 쉽기 때문이다. ([tinyauth 프록시 컨트롤러](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L356-L369))

| 요청 상황 | Traefik 경로의 tinyauth 판정 | 클라이언트가 받는 최종 응답 / 앱 도달 |
|---|---|---|
| 미인증 | 브라우저 `302 /login` · 비브라우저 `401` | `302` 또는 `401` / 0건 |
| 로그인 완료 및 접근 허용 | `200` | `reports` 앱의 응답 / 1건 |
| 로그인했으나 권한 부족 | 브라우저 `302 /unauthorized` · 비브라우저 `403` | `302` 또는 `403` / 0건 |

`User-Agent`에 `Chrome` 같은 브라우저 패턴이 잡히면 `302` 리다이렉트 분기를 타고, `curl/8.7.1` 같은 비브라우저 요청이나 `/api/auth/nginx` 경로는 `401`/`403` JSON 응답과 함께 목적지를 알려주는 `x-tinyauth-location` 헤더를 받는다.

:::example 로그인 없이 /reports에 접속했다가 돌아오는 흐름
1. 로그인하지 않은 브라우저가 `https://reports.example.com/reports`를 요청한다.
2. tinyauth는 원래 scheme, host, URI를 `redirect_uri`에 담아 `/login?redirect_uri=...`로 `302` 응답을 보낸다.
3. 사용자가 로그인에 성공하면(TOTP가 남지 않은 일반 로그인 기준), `/continue` 화면을 거쳐 브라우저가 `/reports`를 **처음부터 새로 요청**한다.
:::

:::reveal
로그인 후 `/reports`로 돌아오는 요청은 이전에 멈춰 있던 요청이 이어서 재개되는 걸까, 아니면 완전히 새로운 요청일까?
완전히 **새로운 HTTP 요청**이다. 앞선 요청은 `302` 응답을 받으면서 이미 끝났고, `/continue` 페이지가 브라우저를 이동시키면 브라우저가 새 요청을 보내므로 프록시도 인증 서브요청을 처음부터 다시 실행한다. ([tinyauth 복귀 페이지](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/pages/continue-page.tsx#L43-L95))
:::

:::warn
복귀 화면(`/continue`)은 `redirect_uri`를 그대로 믿고 바로 이동시키지 않는다. URL 형식과 HTTP(S) 조건을 검사해 신뢰 범위 밖 주소이거나 HTTPS에서 HTTP로 내려가는 이동이면(경고 설정이 켜진 경우) 자동 이동을 멈추고 사용자에게 계속할지 묻는다. ([redirect_uri 검증 로직](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/frontend/src/lib/hooks/redirect-uri.ts#L42-L117))
:::

:::note
이 레슨의 표와 흐름은 Traefik v3.6.2·tinyauth 코드와 공식 문서 계약에서 도출한 예측이다. 실제 프록시 HTTP 통신과 브라우저 리다이렉트 동작은 뒤이어 구축 단계에서 직접 검증한다.
:::

:::quiz
파일 다운로드 요청에서 인증 서버는 `204`, 파일 앱은 파일이 없어 `404`를 반환한다. 별도 설정이 없는 Traefik과 Nginx에서 클라이언트가 최종적으로 받는 상태 코드는?
- [ ] 두 프록시 모두 `204`를 받는다
  Feedback: `204`는 `2xx`이므로 프록시가 이를 최종 응답으로 돌려주지 않고 파일 앱으로 요청을 넘긴다.
- [ ] Traefik에서는 `204`, Nginx에서는 `404`를 받는다
  Feedback: Traefik과 Nginx 모두 `204`를 포함한 `2xx`를 "허용"으로 보고 보호 앱에 요청을 전달한다.
- [x] 두 프록시 모두 `404`를 받는다
  Feedback: 인증 서버의 `204`는 통과 신호일 뿐이다. 요청을 넘겨받은 파일 앱이 만든 `404`가 클라이언트의 최종 응답이 된다.
:::

:::quiz
Nginx 기본 `auth_request`의 인증 서브요청이 로그인 주소가 담긴 `302`를 받았다. 원래 요청은 어떻게 될까?
- [x] 서브요청 오류로 처리되어 앱에 도달하지 않는다
  Feedback: 기본 `auth_request` 모듈은 `2xx`, `401`, `403` 외의 상태 코드를 오류로 처리한다. 로그인 페이지로 보내려면 별도 error_page 설정 등이 필요하다.
- [ ] 브라우저가 로그인 주소로 이동하고 앱 도달은 0건이다
  Feedback: 유효한 `Location` 헤더를 가진 `302`를 브라우저에 그대로 전달하는 것은 Traefik ForwardAuth의 기본 동작이다.
- [ ] 앱으로 진행하고 앱이 로그인 이동 여부를 정한다
  Feedback: `302`는 허용 범위(`2xx`) 밖이므로 보호 앱까지 요청이 넘어가지 않는다.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html) · [로그인 후 프론트 복귀](./0005-oauth2-cookie-state-and-frontend-return.html) · [프론트 인증 상태 복원](./0006-react-auth-bootstrap-after-oauth2.html) · [PKCE](./0007-oauth2-fragment-implicit-flow-pkce.html) · [ID Token 검증 기록](../learning-records/0004-oauth2-state-and-id-token-validation.md) · [OAuth2 최종 정리](../summaries/0001-oauth2-final-summary-and-learning-patterns.md)

:::source
[Traefik v3.6 ForwardAuth 공식 문서](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/) 첫 문단에서 `2xx` 응답일 때와 그 밖의 응답일 때 각각 누가 요청을 이어받는지 읽어 보자.
:::

:::ask
Teach Session에서 인증 `204` 뒤에 앱 `404`가 오는 상황을 놓고, 각 HTTP 응답이 어느 TCP/HTTP 연결에서 끝나는지 함께 따라가 보자.
:::
