# 접근 거부와 판정 실패를 구분하기
Lang: ko
Target: 응답·오류 로그·앱 도달 건수로 명시적 거부와 인증 서비스 장애를 구분한다.

:::recap
[0057](./0057-proxy-forward-auth-decision-contract.html)에서 인증 응답을 받은 proxy가 원 요청의 다음 단계를 결정했다. 이번에는 그 응답 자체가 없거나 인증 서비스가 내부 오류를 보고하는 경우를 보자.
:::

:::key
같은 원 요청에 대해 인증 결과, proxy 로그, 앱 도달 건수를 함께 읽는다. 403 하나로는 정책이 명시적으로 거부했는지 판정을 얻지 못했는지 결정할 수 없다.
:::

## 같은 보호 요청 한 건을 보낸 경우

아래 표는 retry와 bypass를 제외한 Traefik v3.6.2 구성의 코드 기반 예측이다. 인증 서비스가 웹 응답을 실제로 줬는지부터 구분한다. [Traefik forward.go:196–208,235–264,290–298 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L196-L208) · [인증 응답 처리](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L235-L298)

| 상황 | 인증 서비스 응답 | 클라이언트 응답 예측 | 앱 도달 예측 |
|---|---|---|---|
| 정상, 허용 | 2xx | 앱 응답 | 1건 |
| 정상, 권한 부족 | tinyauth의 403 JSON 또는 302 `/unauthorized` | 403 또는 302 | 0건 |
| tinyauth가 ACL 조회 오류를 처리함 | 500 JSON 또는 302 `/error` | 500 또는 302 | 0건 |
| 인증 서비스 중단, Traefik 호출 실패 | HTTP 응답 없음 | 일반 호출 오류의 경우 proxy 500 | 0건 |

tinyauth의 Traefik용 browser 분기에서는 권한 부족과 ACL 조회 오류가 모두 302이며 목적지가 다르다. 비브라우저 분기에서는 각각 403, 500이다. 인증 서비스의 내부 오류는 인증 서비스가 응답했다는 점에서 통신 실패와 구별된다. Traefik의 요청 context 취소도 일반 호출 오류와 별도 분기다. [tinyauth proxy_controller.go:110–116,188–221,336–369 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L110-L116) · [권한 거부](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L188-L221) · [오류 응답](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L336-L369) · [Traefik 호출 오류 분기](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L196-L208)

:::steps
1. 정상일 때 같은 보호 경로의 허용 한 건과 거부 한 건을 비교한다. 인증 응답 여부와 앱의 요청 건수를 적는다.
2. 중단을 가정하고 해당 요청 시각의 proxy 로그·trace에서 인증 서비스 호출 오류를 찾는다.
3. 브라우저 또는 클라이언트 상태와 앱 도달 건수를 대조한다. 원 요청 건수에는 redirect를 따라간 다른 화면 요청을 합치지 않는다.
:::

:::compare
### Envoy ext_authz · fail-closed

기본 `failure_mode_allow=false`이면 통신 실패 또는 인증 서비스의 HTTP 5xx에서 필터가 요청을 차단한다. `status_on_error`의 기본 응답은 403이다.

### Envoy ext_authz · fail-open

`failure_mode_allow=true`이면 같은 실패에서 필터를 통과시킨다. 이후 최종 도달과 응답은 나머지 router와 앱 처리에 달려 있다.
:::

Envoy 상태는 [ext_authz 설정 계약](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_authz/v3/ext_authz.proto#extensions-filters-http-ext-authz-v3-extauthz)의 `failure_mode_allow` 및 `status_on_error`를 대조했다. 상태와 실제 앱 도달 건수는 배포 환경에서 관찰할 대상이다.

:::quiz
Envoy의 기본 응답은 403이고 앱 도달은 0건이다. proxy에는 인증 서비스 연결 실패가 기록됐고 인증 HTTP 응답은 없다. 무엇을 관찰한 걸까?
- [ ] 인증 서비스가 사용자의 권한을 검사해 거부했다
  Feedback: 이 기록에는 인증 서비스의 판정 응답이 없다. proxy가 연결 실패를 처리했다.
- [x] proxy가 판정을 얻지 못해 기본 정책으로 차단했다
  Feedback: 기본 Envoy에서는 통신 실패라도 403이 가능하다. 로그와 응답 유무를 같이 보면 원인이 드러난다.
- [ ] 보호 앱이 요청을 처리한 뒤 403을 돌려줬다
  Feedback: 해당 원 요청은 앱으로 들어오지 않았다. proxy에서 응답한 것이다.
:::

:::terms
- Fail-closed: 판정 시스템에서 오류가 났을 때 차단하는 정책.
- Fail-open: 판정 시스템에서 오류가 났을 때 통과시키는 정책.
:::

Traefik 정상·중단 비교는 이 레슨에서 예상 관측값을 읽는 연습이다. 실제 HTTP·로그·앱 수신 횟수는 구축 단계에서 확인한다. [Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[Envoy ext_authz 공식 설정](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_authz/v3/ext_authz.proto#extensions-filters-http-ext-authz-v3-extauthz)에서 `failure_mode_allow`와 `status_on_error`를 같이 읽고 장애 때 403이 가능한 이유를 짚자.
:::

:::ask
Teach Session에서 상태가 둘 다 500인 두 요청을 놓고, 인증 서비스 응답과 proxy 호출 로그로 어떻게 구분하는지 따라가 보자.
:::
