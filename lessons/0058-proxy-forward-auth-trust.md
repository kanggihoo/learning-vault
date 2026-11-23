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
- 신원 헤더 (`Remote-*`): 보호 앱이 직접 로그인을 구현하지 않는 대신, 프록시와 인증 서버로부터 "이 요청을 보낸 사용자가 누구이고 어떤 권한 그룹에 속하는지"를 전달받는 HTTP 헤더 (`Remote-User`, `Remote-Groups` 등).
- Forwarded 헤더 (`X-Forwarded-*`): 브라우저와 뒷단 서버 사이에 프록시가 끼어 있을 때, 프록시가 원래 요청의 호스트, URI, 프로토콜, 메서드, 클라이언트 IP 정보를 뒷단(인증 서버·보호 앱)에 알려주기 위해 붙이는 HTTP 헤더.
- 신뢰 경계 (Trust Boundary): 시스템에서 "이 선 안쪽(내가 통제하는 프록시·서버)에서 온 연결과 헤더만 진짜로 믿고, 선 바깥(브라우저·인터넷)에서 온 값은 위조될 수 있다고 가정한다"고 긋는 보안 경계선.
:::

:::iframe
[원래 요청, 인증 서브요청, 앱 요청이 오가는 순서](../figures/0057-forward-auth-request-flow.html)
GET 예시에서 `Remote-User` 헤더가 tinyauth 응답에서 처음 만들어진 뒤 앱 요청으로 복사되는 지점을 확인하자.
mode: archify
height: 720px
:::

## `Remote-User`와 `Remote-Groups`는 왜 쓸까?

보통의 웹 앱은 자체 로그인 화면과 세션·JWT 검증 로직을 갖고 있어서 "지금 요청한 사람이 누구인지" 스스로 안다. 반면 **프록시 기반 인증(ForwardAuth)** 구조에서는 로그인과 인증 검사를 앞단의 프록시(Traefik)와 인증 서버(tinyauth)가 대신 처리한다.

이때 뒷단의 보호 앱(`reports`)은 쿠키나 세션을 직접 해석하지 않는다. 대신 프록시가 요청을 넘겨줄 때 **HTTP 요청 헤더**에 인증 결과를 실어 주면, 앱은 그 헤더만 읽고 로그인된 사용자로 인식한다. 전통적인 CGI·리버스 프록시 관례에서 유래한 이 헤더들이 `Remote-*` 계열이다.

- `Remote-User`: 인증된 사용자의 아이디(예: `alice`)
- `Remote-Groups`: 사용자가 속한 그룹·역할 목록(예: `admin,dev`). 앱이 관리자 권한 등을 판단할 때 주로 읽는다.
- `Remote-Name`, `Remote-Email`, `Remote-Sub`: 각각 표시 이름, 이메일, OAuth 고유 식별자(`sub`)를 전달할 때 쓴다.

## 요청 하나가 3개의 HTTP 요청으로 나뉜다

브라우저가 `https://reports.example.com/reports?month=11`로 `POST` 요청을 보내면, Traefik v3.6.2(기본 `preserveRequestMethod` 비활성 기준)는 이 작업을 3개의 서로 다른 HTTP 요청 구간으로 처리한다. ([Traefik ForwardAuth 코드](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L372-L414))

| 구간 | HTTP Host | Path와 query | 실제 method |
|---|---|---|---|
| 1. 브라우저 → Traefik | `reports.example.com` | `/reports?month=11` | `POST` |
| 2. Traefik → tinyauth (인증 서브요청) | `auth.example.com` | `/api/auth/traefik` | `GET` |
| 3. Traefik → 보호 앱 (허용 뒤) | `reports.example.com` | `/reports?month=11` | `POST` |

왜 2번 구간의 메서드가 `POST`가 아니라 `GET`일까? 인증 서버는 요청 본문(`POST` body)을 처리하는 곳이 아니라 "접근을 허용할지"만 판단하기 때문에 Traefik이 기본적으로 `GET` 서브요청을 보낸다.

### `X-Forwarded-*` 헤더는 누가 붙이고 어디에 쓸까?

인증 서버(tinyauth) 입장에서는 Traefik이 보낸 `GET /api/auth/traefik` 요청만 받기 때문에, 헤더가 없다면 "브라우저가 원래 어느 도메인, 어느 경로, 어떤 프로토콜과 메서드로 접속하려 했는지" 알 수 없다. 그래서 **리버스 프록시(Traefik의 ForwardAuth 미들웨어)가 2번 구간 서브요청을 보낼 때 원래 요청의 정보를 `X-Forwarded-*` 헤더에 자동으로 실어 보낸다.** (Nginx `auth_request`처럼 자동 주입이 없는 프록시는 설정 파일에서 `proxy_set_header`로 직접 지정해야 한다.)

| 헤더 이름 | 예시 값 | 의미 | 인증 서버(tinyauth)가 쓰는 곳 |
|---|---|---|---|
| `X-Forwarded-Host` | `reports.example.com` | 브라우저가 원래 요청한 호스트(도메인) | 어느 앱의 접근 규칙(ACL)을 볼지 결정하고, 로그인 후 돌아갈 주소 생성 |
| `X-Forwarded-Uri` | `/reports?month=11` | 브라우저가 원래 요청한 경로와 쿼리 | 경로별 접근 제어(ACL) 및 로그인 후 원래 페이지 복귀 |
| `X-Forwarded-Proto` | `https` | 브라우저 ↔ 프록시 구간의 프로토콜 | 로그인 후 복귀할 `redirect_uri`의 `http`/`https` 결정 |
| `X-Forwarded-Method` | `POST` | 브라우저가 원래 보낸 HTTP 메서드 | 서브요청은 `GET`이지만 원래 메서드가 무엇이었는지 기록·판단할 때 참고 |
| `X-Forwarded-For` | `203.0.113.10` | 원래 요청을 보낸 클라이언트의 IP 주소 | IP 기반 허용/차단 인가(Authorization) 검사 |

tinyauth가 인증을 통과시키며 응답에 `Remote-User: alice`를 실어 보내면, Traefik은 설정된 `authResponseHeaders` 목록에 따라 그 값을 3번 구간의 원래 요청에 복사해 앱으로 넘긴다.

:::example tinyauth가 인가(Authorization)에 쓰는 값과 복귀에 쓰는 값
tinyauth는 전달받은 `X-Forwarded-Uri`(`/reports?month=11`)를 한 가지 모양으로만 쓰지 않고, 목적에 따라 두 가지 형태로 나누어 컨텍스트에 담는다.

- **ACL(접근 제어 목록) 인가 검사(`Path`)**: `/reports?month=11`에서 `?month=11` 같은 조회 조건(쿼리)을 떼어내고, `/reports/../reports`나 `/reports//`처럼 지저분하거나 우회를 노린 경로 표기를 `path.Clean`으로 표준 경로(`/reports`)로 정리(정규화)한 값만 사용한다. 쿼리 값이나 비틀린 경로 문자열 때문에 인가 규칙이 어긋나거나 뚫리는 것을 막기 위함이다.
  - 참고로 **프록시 단 인가는 앱 내부 인가와 범위가 다르다.** 앱 내부에서는 `GET`(조회) vs `DELETE`(삭제)나 게시글 작성자 여부까지 따져 세밀하게 인가하지만, tinyauth의 인가 구조체(`ACLContext`)에는 `GET`/`POST` 같은 HTTP 메서드조차 들어가지 않는다. tinyauth는 "이 사용자가 `/reports` 문 안으로 들어갈 수 있는가"만 거칠게 걸러주는 1차 문지기이고, 메서드별·데이터별 세밀한 인가는 여전히 뒷단 보호 앱이 `Remote-User`·`Remote-Groups`를 받아 직접 처리해야 한다.
- **로그인 후 복귀(`PathRaw`)**: 미인증 사용자가 "11월 리포트" 링크(`/reports?month=11`)를 눌렀다고 해 보자. 로그인이 안 되어 있으므로 tinyauth는 사용자를 로그인 화면(`302 /login?redirect_uri=...`)으로 보낸다. 여기서 `redirect_uri`는 **"로그인이 끝나면 다시 돌려보낼 원래 주소"**다. 만약 이때 `?month=11`을 지우고 `/reports`만 기억해 두면, 로그인 뒤 11월 조건이 날아간 기본 리포트 화면으로 돌아가 버린다. 그래서 복귀 주소를 만들 때는 쿼리까지 포함된 원본 `/reports?month=11`을 그대로 보관한다.

([tinyauth 컨텍스트 추출 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L388-L417))
:::

## 신뢰 경계란 무엇이며, 어디서 갈릴까?

HTTP 헤더는 그냥 요청에 실려 오는 텍스트 줄이다. 즉, **브라우저나 `curl`을 쓰는 외부 공격자도 요청을 보낼 때 `X-Forwarded-For: 127.0.0.1`이나 `Remote-User: admin` 같은 헤더를 자기 마음대로 써서 보낼 수 있다.**

그래서 시스템은 **"어디까지는 내가 통제하는 내부(신뢰할 수 있는 프록시)이고, 어디부터는 위조 가능성이 있는 외부(클라이언트)인지"** 경계선을 그어야 한다. 이 선이 **신뢰 경계(Trust Boundary)**이며, 프록시 인증 구조에서는 아래 두 지점에서 신뢰 경계가 갈린다.

:::compare 신뢰 경계가 갈리는 두 지점
### 1. 인증 서버의 클라이언트 IP 신뢰 (`TrustedProxies`)

외부 공격자가 요청에 가짜 `X-Forwarded-For` 헤더를 끼워 보낼 수 있기 때문에, tinyauth는 아무 요청의 `X-Forwarded-For`나 그대로 믿으면 안 된다. tinyauth는 `Auth.TrustedProxies` 설정에 등록된 IP(앞단 Traefik 프록시)만 신뢰하도록 Gin 프레임워크에 넘겨 `c.ClientIP()`로 실제 클라이언트 IP를 계산한다. 앞단 프록시를 올바르게 지정하지 않으면, 공격자가 헤더를 위조해 IP 제한을 우회하거나 반대로 모든 접속자의 IP가 프록시 IP 하나로만 보여 IP 기반 접근 정책이 엉뚱하게 동작한다. ([tinyauth 부트스트랩 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/bootstrap/router_bootstrap.go#L27-L42))

### 2. 보호 앱의 사용자 신원 신뢰 (`Remote-*` 헤더)

보호 앱은 로그인 검증을 직접 하지 않고 요청에 들어 있는 `Remote-User` 같은 헤더만 믿고 사용자를 식별한다. 만약 앱 포트(예: `8080`)가 외부 인터넷에 직접 열려 있으면, 공격자가 Traefik을 거치지 않고 앱에 직접 접속해 `Remote-User: admin` 헤더를 위조해 보낼 수 있다. 따라서 앱으로 직접 들어오는 연결을 네트워크 레벨에서 막아 **반드시 신뢰하는 프록시를 거쳐 온 요청만 받도록** 해야 하며, 프록시가 관리하는 헤더 목록과 앱이 읽는 헤더 목록이 정확히 일치하는지도 대조해야 한다.
:::

## 헤더 이름 하나를 빠뜨리면 생기는 보안 구멍

앞단 프록시(Traefik)를 거치더라도 설정이 어긋나면 위조된 헤더가 앱까지 뚫고 들어갈 수 있다.

tinyauth는 인증을 마친 사용자에게 `Remote-User`, `Remote-Name`, `Remote-Email`을 설정하고, LDAP/OAuth 로그인에는 `Remote-Groups`, OAuth 로그인에는 `Remote-Sub`를 추가로 붙인다. ([tinyauth 헤더 설정 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/proxy_controller.go#L268-L287))

이 헤더들을 앱으로 넘겨주려면 Traefik의 `authResponseHeaders`(또는 정규식 설정)에 해당 헤더 이름들이 등록되어 있어야 한다. Traefik의 [성공 응답 처리 코드](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L266-L286)는 다음과 같은 순서로 동작한다.

1. `authResponseHeaders` 목록에 들어 있는 헤더 이름을 **브라우저가 보낸 원래 요청에서 먼저 모두 삭제**한다. (혹시 클라이언트가 몰래 끼워 보낸 가짜 값이 있다면 여기서 지워진다.)
2. 그다음 tinyauth의 인증 응답에 해당 헤더 값이 있을 때만 앱으로 가는 요청에 새로 복사한다.

여기서 구멍이 생긴다. 만약 앱은 `Remote-Groups` 헤더를 읽어 `admin` 그룹 여부를 판단하는데, Traefik의 `authResponseHeaders` 설정에 `Remote-User`만 넣고 **`Remote-Groups`를 빠뜨렸다고 하자.** 그러면 브라우저(공격자)가 요청에 몰래 실어 보낸 `Remote-Groups: admin` 헤더는 Traefik의 삭제 목록에 없으므로 **지워지지 않고 앱까지 그대로 통과**해 버린다. 결국 일반 사용자로 로그인하고도 관리자 권한을 얻는 심각한 취약점이 된다.

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
