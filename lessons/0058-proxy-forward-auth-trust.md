# 앱은 왜 Remote-User를 믿을 수 있을까
Lang: ko
Target: 원래 요청·인증 서브요청·앱 요청의 host, path, method를 대조하고 앱이 읽는 신원 헤더의 출처와 통제 지점을 짚는다.

:::recap
[앞선 레슨](./0057-proxy-forward-auth-decision-contract.html)에서는 Traefik이 tinyauth의 `200` 허가를 받은 뒤 `reports` 앱에 요청을 넘겼다. 이번에는 브라우저가 `POST` 요청을 보냈을 때, `reports` 앱이 받는 `Remote-User` 헤더가 어디서 만들어지고 왜 안전하게 믿을 수 있는지(또는 언제 뚫리는지) 추적해 보자.
:::

:::key
보호 앱이 `Remote-User` 같은 신원 헤더를 믿으려면 두 가지 조건이 동시에 지켜져야 한다. 첫째, 클라이언트가 프록시를 우회해 앱 포트에 직접 접속할 수 없어야 한다. 둘째, 프록시가 인증 서버 응답을 복사하기 전에 원래 요청에 섞여 들어온 같은 이름의 헤더를 먼저 지워야 한다.
:::

:::terms
- 신원 헤더: 보호 앱이 사용자 이름, 이메일, 그룹 같은 로그인 정보를 전달받는 HTTP 헤더 (`Remote-User`, `Remote-Groups` 등).
- 신뢰 경계: 시스템 구성 요소가 "이 안쪽에서 온 연결과 헤더만 믿겠다"고 선을 긋는 보안 경계.
- Forwarded 헤더: 프록시가 원래 요청의 호스트, URI, 프로토콜, 메서드 정보를 뒷단 서버에 전달할 때 쓰는 `X-Forwarded-*` 헤더.
:::

:::iframe
[원래 요청, 인증 서브요청, 앱 요청이 오가는 순서](../figures/0057-forward-auth-request-flow.html)
GET 예시에서 `Remote-User` 헤더가 tinyauth 응답에서 처음 만들어진 뒤 앱 요청으로 복사되는 지점을 확인하자.
mode: archify
height: 720px
:::

## 요청 하나가 3개의 HTTP 요청으로 나뉜다

브라우저가 `https://reports.example.com/reports?month=11`로 `POST` 요청을 보내면, Traefik v3.6.2(기본 `preserveRequestMethod` 비활성 기준)는 이 작업을 3개의 서로 다른 HTTP 요청 구간으로 처리한다. ([Traefik ForwardAuth 코드](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L372-L414))

| 구간 | HTTP Host | Path와 query | 실제 method |
|---|---|---|---|
| 1. 브라우저 → Traefik | `reports.example.com` | `/reports?month=11` | `POST` |
| 2. Traefik → tinyauth (인증 서브요청) | `auth.example.com` | `/api/auth/traefik` | `GET` |
| 3. Traefik → 보호 앱 (허용 뒤) | `reports.example.com` | `/reports?month=11` | `POST` |

왜 2번 구간의 메서드가 `POST`가 아니라 `GET`일까? 인증 서버는 본문을 처리하는 곳이 아니라 "접근을 허용할지"만 판단하기 때문에 Traefik이 기본적으로 `GET` 서브요청을 보낸다. 대신 원래 요청의 정보는 `X-Forwarded-Host: reports.example.com`, `X-Forwarded-Uri: /reports?month=11`, `X-Forwarded-Proto: https`, `X-Forwarded-Method: POST` 헤더에 실어 보낸다.

tinyauth가 인증을 통과시키며 응답에 `Remote-User: alice`를 실어 보내면, Traefik은 설정된 `authResponseHeaders` 목록에 따라 그 값을 3번 구간의 원래 요청에 복사해 앱으로 넘긴다.

:::example tinyauth가 정책 검사에 쓰는 값과 복귀에 쓰는 값
tinyauth는 전달받은 `X-Forwarded-*` 헤더로 요청 컨텍스트를 만든다. 이때 같은 경로라도 쓰임새에 따라 값을 다르게 다룬다.
- **ACL 정책 검사(`Path`)**: `/reports?month=11`에서 쿼리를 떼고 `path.Clean`으로 정규화한 `/reports`를 사용한다. (참고로 `ACLContext`에는 HTTP 메서드가 들어가지 않는다.)
- **로그인 복귀(`PathRaw`)**: 로그인 후 원래 보려던 조건을 잃지 않도록 쿼리까지 포함한 `/reports?month=11`을 그대로 보관한다.
([tinyauth 컨텍스트 추출 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L388-L417))
:::

:::compare 신뢰 경계가 갈리는 두 지점
### 인증 서버의 클라이언트 IP 신뢰

tinyauth는 `Auth.TrustedProxies` 설정을 Gin 프레임워크에 넘겨 `c.ClientIP()`로 실제 클라이언트 IP를 계산한다. 앞단 프록시를 신뢰하도록 올바르게 지정하지 않으면 IP 기반 접근 정책이 엉뚱한 주소를 보게 된다. ([tinyauth 부트스트랩 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/bootstrap/router_bootstrap.go#L27-L42))

### 보호 앱의 사용자 신원 신뢰

앱이 읽는 `Remote-*` 헤더는 반드시 신뢰하는 프록시를 거쳐 들어온 요청이어야 의미가 있다. 앱 포트가 외부에 직접 열려 있으면 누구나 `Remote-User: admin`을 위조해 보낼 수 있으므로 직접 접근을 막고, 프록시가 관리하는 헤더 목록과 앱이 읽는 헤더 목록이 정확히 일치하는지 대조해야 한다.
:::

## 헤더 이름 하나를 빠뜨리면 생기는 보안 구멍

tinyauth는 인증을 마친 사용자에게 `Remote-User`, `Remote-Name`, `Remote-Email`을 설정하고, LDAP/OAuth 로그인에는 `Remote-Groups`, OAuth 로그인에는 `Remote-Sub`를 추가로 붙인다. ([tinyauth 헤더 설정 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L268-L287))

문제는 Traefik의 `authResponseHeaders`(또는 정규식 설정)가 이 이름들을 빠짐없이 관리하고 있느냐다. Traefik의 [성공 응답 처리 코드](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L266-L286)는 관리 목록에 들어 있는 헤더 이름을 **원래 요청에서 먼저 삭제한 뒤**, 인증 서버 응답에 값이 있을 때만 새로 복사한다. 만약 앱은 `Remote-Groups`를 읽어 관리자 권한을 주는데, Traefik 설정에서 `Remote-Groups`를 빼먹으면 브라우저가 몰래 보낸 `Remote-Groups: admin` 헤더가 지워지지 않고 앱까지 그대로 통과할 수 있다.

:::reveal
앱이 `Remote-User`와 `Remote-Groups`를 모두 읽는데, 로컬 사용자 Alice에게는 tinyauth가 그룹 값을 발급하지 않았다. Traefik이 두 헤더 이름을 모두 `authResponseHeaders`로 관리하고 있다면, 공격자가 원래 요청에 실어 보낸 `Remote-Groups: admin` 헤더는 어떻게 될까?
원래 요청의 `Remote-Groups`는 인증 응답을 복사하기 전에 **먼저 삭제**된다. 그리고 tinyauth 응답에는 `Remote-Groups` 값이 비어 있으므로 복사할 값도 없어, 앱에는 그룹 헤더가 없는 상태(빈 자리)로 전달된다.
:::

:::warn
두 가지를 함께 점검해야 한다.
1. tinyauth의 ACL 응답 헤더 설정이 앞서 만든 `Remote-*` 신원 헤더를 덮어쓸 수 있다.
2. 프록시를 거친 신뢰 경로라도, 앱이 필수로 요구하는 신원 헤더가 비어 있다면 절대 인증된 사용자로 처리해서는 안 된다.
:::

:::quiz
앱 포트에 외부에서 직접 접근할 수 있는 상태이고, Traefik 설정에는 `Remote-User`가 등록되어 있다. 앱의 신원 판단 보안을 위해 가장 먼저 확인하고 막아야 할 것은?
- [ ] tinyauth의 세션 쿠키 만료 시간이 충분히 긴지
  Feedback: 세션 수명은 인증 서버가 판정할 때만 쓰인다. 앱 포트로 직접 들어오는 연결은 아예 인증 서버를 거치지 않는다.
- [x] 앱 포트에 신뢰한 프록시를 우회하는 직접 연결이 허용되는지
  Feedback: 앱 포트로 직접 연결하면 Traefik의 헤더 삭제·복사 규칙이 전혀 동작하지 않으므로, 클라이언트가 `Remote-User`를 마음대로 위조할 수 있다.
- [ ] 앱 포트에서 HTTPS를 쓸 수 있는지
  Feedback: 통신 구간을 암호화하더라도, 그 요청 안의 신원 헤더를 신뢰할 수 있는 프록시가 만들었는지는 별개 문제다.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[Traefik v3.6 ForwardAuth 설정 문서](https://doc.traefik.io/traefik/v3.6/reference/routing-configuration/http/middlewares/forwardauth/#configuration-options)에서 `authRequestHeaders`(요청 시 인증 서버로 보낼 헤더)와 `authResponseHeaders`(응답 시 앱으로 복사할 헤더)가 서로 다른 구간에 적용되는 점을 확인하자.
:::

:::ask
Teach Session에서 앱이 사용자(`Remote-User`)와 그룹(`Remote-Groups`)을 모두 읽는 상황을 놓고, 세 HTTP 요청 구간 표와 각 헤더의 출처를 함께 채워 보자.
:::
