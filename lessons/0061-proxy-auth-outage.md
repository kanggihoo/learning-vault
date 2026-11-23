# 접근 거부와 판정 실패를 구분하기
Lang: ko
Target: 응답·오류 로그·앱 도달 건수로 명시적 거부와 인증 서비스 장애를 구분한다.

:::recap
[0057 레슨](./0057-proxy-forward-auth-decision-contract.html)에서는 인증 서버가 보낸 `200`이나 `403`, `302`를 프록시가 어떻게 처리하는지 봤다. 이번에는 인증 서버 내부에서 오류가 나거나 아예 인증 서버가 죽어서 응답을 못 줄 때, 겉으로 보이는 상태 코드가 어떻게 겹치고 어떻게 구분해야 하는지 살펴보자.
:::

:::key
클라이언트가 `403`, `302`, `500` 같은 상태 코드를 받았을 때 **상태 코드 숫자 하나만으로는 "권한이 없어서 거절당한 것"인지 "인증 서버 장애로 판정을 못 받은 것"인지 알 수 없다.** 인증 서버의 실제 HTTP 응답 유무, 프록시 오류 로그, 그리고 앱 도달 건수를 함께 대조해야 원인이 드러난다.
:::

:::terms
- Fail-closed: 인증 시스템과 통신할 수 없거나 오류가 났을 때 보안을 위해 요청을 **차단**하는 정책.
- Fail-open: 인증 시스템 장애 시 서비스 중단을 막기 위해 일단 요청을 **통과**시키는 정책.
:::

## 정상 거부, 내부 오류, 연결 실패의 차이

retry나 IP bypass 설정이 없는 Traefik v3.6.2 + tinyauth 구성을 기준으로, 보호 요청 한 건이 들어왔을 때 네 가지 상황을 나란히 놓아 보자.

| 상황 | 인증 서버(tinyauth) 응답 | 클라이언트 최종 응답 | 앱 도달 건수 |
|---|---|---|---|
| 정상, 접근 허용 | `2xx` | 보호 앱 응답 | 1건 |
| 정상, 권한 부족 | `403` JSON 또는 `302 /unauthorized` | `403` 또는 `302` | 0건 |
| tinyauth 내부 오류 (ACL 조회 실패 등) | `500` JSON 또는 `302 /error` | `500` 또는 `302` | 0건 |
| 인증 서버 중단 (Traefik 호출 실패) | **HTTP 응답 없음** | 일반 호출 오류 시 프록시 `500` | 0건 |

브라우저 요청을 기준으로 보면 권한 부족(`302 /unauthorized`)과 ACL 조회 오류(`302 /error`) 모두 `302`로 보이며 리다이렉트 목적지만 다르다. (비브라우저 요청은 각각 `403`, `500` JSON 응답이다. [tinyauth 오류·거부 분기](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L188-L221)) 반면 인증 서버가 죽어 연결 자체가 실패하면 tinyauth로부터 **HTTP 응답 자체가 오지 않으며**, [Traefik의 호출 오류 분기](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L196-L208)가 이를 잡아 debug/error 로그를 남기고 `500`(요청 context 취소 시 별도 상태)을 돌려준다.

:::steps 장애와 거부를 가려내는 3단계 점검
1. 정상 상태일 때 같은 경로의 허용 요청 1건과 거부 요청 1건을 비교해, 인증 서버 응답 유무와 앱 도달 건수 기준점을 잡는다.
2. 문제가 생긴 시각의 프록시 오류 로그·trace에서 인증 서버 호출 실패 기록이 있는지 찾는다.
3. 클라이언트가 받은 상태 코드와 앱에 실제 찍힌 요청 건수를 대조한다. (이때 `302`를 따라가 로그인/오류 화면을 연 별도 요청은 원래 요청 건수에 합치지 않는다.)
:::

:::compare Envoy ext_authz의 장애 대응 정책
### Fail-closed (기본값)

`failure_mode_allow=false`(기본값)이면 인증 서버와 통신에 실패하거나 인증 서버가 `5xx`를 돌려줄 때 필터가 요청을 차단한다. 이때 `status_on_error`의 기본 응답 코드는 **`403`**이다. ([Envoy ext_authz 설정](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_authz/v3/ext_authz.proto#extensions-filters-http-ext-authz-v3-extauthz))

### Fail-open

`failure_mode_allow=true`로 두면 같은 통신 실패나 `5xx` 상황에서 인증 필터를 그대로 통과시킨다. 이후 최종 응답은 뒷단 라우터와 보호 앱의 처리에 맡겨진다.
:::

:::example 인증 서버가 죽었는데 왜 500이 아니라 403이 뜰까?
Envoy의 `ext_authz` 필터를 기본값(`failure_mode_allow=false`)으로 쓰고 있다면, 인증 서버가 다운되어 응답을 못 주는 상황에서도 `status_on_error` 기본값 때문에 클라이언트에게 `403`이 내려간다. 겉보기에는 "권한 부족으로 거절된 정상 응답"과 똑같다. 프록시 로그에 연결 실패가 찍혀 있고 인증 서버 응답 기록이 없다는 사실을 함께 확인해야만 장애였음을 알아낼 수 있다.
:::

:::note
이 레슨의 비교와 판단 기준은 Traefik·tinyauth 코드 및 Envoy 공식 설정 계약에서 정리한 것이다. 실제 HTTP 응답과 로그, 앱 수신 건수는 구축 단계에서 직접 확인한다.
:::

:::quiz
Envoy `ext_authz`가 기본 설정으로 동작 중이고, 클라이언트는 `403`을 받았고 앱 도달은 `0건`이다. 프록시 로그에는 인증 서버 연결 실패가 기록됐고 인증 서버 쪽 HTTP 응답 기록은 없다. 지금 일어난 일은?
- [ ] 인증 서버가 사용자의 권한을 검사한 뒤 거부했다
  Feedback: 인증 서버의 HTTP 응답 기록 자체가 없으므로 인증 서버가 권한을 판정한 것이 아니다.
- [x] 프록시가 판정을 받지 못해 기본 장애 정책(`fail-closed`)으로 차단했다
  Feedback: Envoy 기본 설정에서는 통신 실패 시에도 `status_on_error` 기본값인 `403`으로 차단할 수 있다. 로그와 인증 응답 유무를 함께 봐야 원인이 보인다.
- [ ] 보호 앱이 요청을 처리한 뒤 `403`을 돌려줬다
  Feedback: 앱 도달이 0건이므로 원래 요청은 앱에 들어가지 않고 프록시 단계에서 끝났다.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[Envoy ext_authz 공식 설정 문서](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_authz/v3/ext_authz.proto#extensions-filters-http-ext-authz-v3-extauthz)에서 `failure_mode_allow`와 `status_on_error` 설명을 함께 읽고, 장애 상황에서 `403`이 반환되는 이유를 확인해 보자.
:::

:::ask
Teach Session에서 클라이언트가 똑같이 `500`을 받은 두 요청을 놓고, 인증 서버의 내부 오류(`500`)와 프록시의 연결 실패(`500`)를 로그와 응답 유무로 어떻게 갈라내는지 따라가 보자.
:::
