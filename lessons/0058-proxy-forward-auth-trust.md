# 앱은 왜 Remote-User를 믿을 수 있을까
Lang: ko
Target: 원 요청·인증 서브요청·앱 요청의 host, path, method를 대조하고 앱이 읽는 신원 헤더의 출처와 통제 지점을 짚는다.

:::recap
[0057의 허용 경로](./0057-proxy-forward-auth-decision-contract.html)에서는 Traefik이 먼저 tinyauth의 판정을 받고 reports 앱에 원 요청을 넘겼다. 이번에는 POST를 보내고 앱에 들어온 사용자 이름이 어디서 왔는지 추적하자.
:::

:::iframe
[원 요청, 인증 서브요청, 앱 요청이 오가는 순서](../figures/0057-forward-auth-request-flow.html)
GET 예시에서 신원 헤더가 tinyauth의 응답에 처음 나타난다. 이어지는 POST 예제에서는 세 요청의 method도 따라가 보자.
mode: archify
height: 720px
:::

## 같은 작업을 세 HTTP 요청으로 적기

예시에서 Traefik v3.6.2는 `preserveRequestMethod` 기본값을 사용한다. auth 주소는 `auth.example.com`이고 앱 요청의 host와 path는 예시 라우팅에서 보존한다. 앞단의 forwarded 헤더를 신뢰하거나 path를 재작성하는 추가 설정은 가정에서 제외한다. 아래 표는 코드·문서에 따른 예측이다. [Traefik forward.go:140–148,372–414 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L140-L148) · [전달하는 method·host·URI](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L372-L414)

| 구간 | HTTP Host | Path와 query | 실제 method |
|---|---|---|---|
| 브라우저 → Traefik | `reports.example.com` | `/reports?month=11` | POST |
| Traefik → tinyauth | `auth.example.com` | `/api/auth/traefik` | GET |
| Traefik → 앱, 허용 뒤 | `reports.example.com` | `/reports?month=11` | POST |

- 인증 서브요청에는 브라우저의 `Cookie`와 원 요청의 정보를 전달한다. `X-Forwarded-Host`는 `reports.example.com`, `X-Forwarded-Uri`는 `/reports?month=11`, `X-Forwarded-Proto`는 `https`, `X-Forwarded-Method`는 POST다.
- 앱 요청의 `Remote-User: alice`는 tinyauth 응답에 있던 신원 값이다. Traefik이 설정한 이름을 원 요청에 옮긴다. [Traefik forward.go:266–271 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L266-L271)

tinyauth는 전달된 host·URI·scheme으로 요청 컨텍스트를 구성한다. ACL에는 정리된 path `/reports`가 들어가고, 로그인 복귀에는 query가 포함된 `PathRaw`가 쓰인다. `ProxyContext.Method`는 이 예시에서 실제 인증 요청의 GET이고, 이 handler가 채우는 `ACLContext`에는 method 항목이 없다. 설정을 검토할 때는 정책이 보는 host/path와 앱이 받는 host/path를 각각 대조한다. [proxy_controller.go:110–126,388–417,624–635 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L110-L126) · [컨텍스트 추출](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L388-L417) · [path 정리](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L624-L635) · [로그인 복귀 경로](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L290-L293)

:::compare
### 인증 서비스의 client IP 판단

tinyauth의 `Auth.TrustedProxies`가 Gin의 trusted proxy를 설정한다. `c.ClientIP()`와 설정 여부가 IP 정책 입력에 들어간다. [router_bootstrap.go:27–42 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/bootstrap/router_bootstrap.go#L27-L42) · [proxy_controller.go:119–137](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L119-L137)

### 보호 앱의 사용자 신원 판단

앱이 읽는 `Remote-*` 값은 신뢰하는 proxy 경로에서 받아야 한다. 앱 포트의 직접 접근을 통제하고, 앱이 신원으로 읽는 헤더 이름 전체를 proxy의 제거·복사 범위와 대조한다. [Traefik forward.go:266–286 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L266-L286)
:::

:::key
앱에서 사용할 이름마다 “누가 이 값을 만들었고 앱까지 어느 경로로 왔나?”를 답할 수 있어야 한다. 신뢰하는 경로에서도 필수 신원 헤더가 비어 있으면 인증된 사용자로 처리할 근거가 없다.
:::

## 이름 하나를 빠뜨리면

tinyauth의 인증 완료 사용자 분기는 `Remote-User`·`Remote-Name`·`Remote-Email`을 설정한다. `Remote-Groups`는 LDAP 또는 OAuth에서, `Remote-Sub`는 OAuth에서 설정한다. 뒤이어 적용되는 ACL 응답 헤더는 같은 이름을 덮을 수 있다. [proxy_controller.go:268–287,315–334 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L268-L287) · [ACL 응답 헤더](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L315-L334)

:::reveal
앱이 Remote-User와 Remote-Groups를 읽는데, local 사용자 Alice에게 tinyauth가 그룹 값을 발급하지 않았다. proxy가 두 이름 모두를 관리하면 기존 요청의 그룹 값은 어떻게 될까?
코드상 지정된 이름은 인증 응답을 읽기 전에 원 요청에서 지워진다. 그룹 응답이 비어 있으면 빈 자리로 남을 것으로 예측한다. 이름을 관리 범위에서 빠뜨린 경우에는 다른 변환이 없다면 client-origin 값이 남을 수 있다. ACL 응답 헤더 재설정과 정규식 설정이 없는 예시다. 실제 app 수신은 미확인이다. [Traefik forward.go:266–286 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L266-L286)
:::

:::quiz
앱 포트에 직접 접근할 수 있고 Traefik은 Remote-User를 관리한다. 앱의 신원 판단을 위해 먼저 확인할 것은?
- [ ] tinyauth의 cookie 만료 시간이 충분히 긴지
  Feedback: 세션 수명은 인증 서비스 판정에 관여한다. 직접 연결은 그 판정을 통과하지 않는다.
- [x] 앱 포트에 신뢰한 proxy를 우회하는 연결이 허용되는지
  Feedback: 앱 포트의 직접 연결에는 Traefik 헤더 관리가 적용되지 않는다. 신원 헤더를 읽는 경로를 먼저 통제한다.
- [ ] 앱 포트에서 HTTPS를 쓸 수 있는지
  Feedback: 전송을 암호화해도 신원 헤더를 어느 구성 요소가 생성했는지는 따로 확인해야 한다.
:::

:::terms
- 신원 헤더: 보호 앱이 사용자 이름, 그룹 등의 신원을 전달받는 HTTP 헤더.
- 신뢰 경계: 구성 요소가 특정 입력이나 연결의 출처를 신뢰하는 범위.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[Traefik v3.6 ForwardAuth 설정](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/#configuration-options)에서 `authRequestHeaders`와 `authResponseHeaders`가 서로 다른 요청 구간에 적용되는 점을 확인하자.
:::

:::ask
Teach Session에서 앱이 사용자와 그룹을 모두 읽는 예를 놓고 세 요청 표와 헤더 출처를 함께 채워 보자.
:::
