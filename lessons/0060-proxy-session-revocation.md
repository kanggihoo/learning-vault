# 브라우저의 로그아웃과 DB 세션 폐기
Lang: ko
Target: DB 세션과 서명·만료만 검사하는 JWT의 갱신·만료·폐기 전후를 비교하고 확인할 값을 짚는다.

:::recap
[앞선 레슨](./0059-proxy-sso-scope.html)에서는 로그인 상태를 앱과 중앙 서버로 나누어 봤다. 이번에는 중앙 tinyauth 세션 하나를 **브라우저의 쿠키**와 **서버 DB의 세션 레코드** 두 층으로 나누어, 갱신과 로그아웃이 각각 어떻게 동작하는지 살펴보자.
:::

:::key
DB 기반 세션에서는 브라우저 쿠키와 서버 DB 레코드가 따로 움직인다. 같은 브라우저에서 로그아웃 뒤 로그인 화면이 다시 뜬다고 해서 DB의 세션 레코드가 반드시 삭제된 것은 아니므로, 브라우저 상태와 DB 상태를 별개로 확인해야 한다.
:::

:::terms
- Sliding 갱신: 유효한 세션을 사용하는 동안 만료가 일정 기준 이하로 가까워지면, 서버가 만료 시각을 뒤로 연장해 주는 방식.
- 세션 폐기: 만료 시각이 오기 전이라도 서버가 해당 세션을 더 이상 유효하지 않게 무효화하는 조치.
:::

## 세션 쿠키 구조와 수명 연장(Sliding 갱신)

tinyauth는 DB에 세션 레코드를 저장한 뒤, 그 세션의 UUID를 쿠키 값으로 내려준다. 쿠키는 `Path=/`, `HttpOnly`, `SameSite=Lax`로 생성되며 `Secure`와 `CookieDomain`(하위 도메인 기능 활성화 시)은 설정을 따른다. ([tinyauth 세션 생성 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L362-L413))

요청이 들어와 세션을 조회할 때, 현재 시각이 만료 시각(`expiry`)을 넘겼거나 설정된 최대 수명(`max lifetime`, 설정값과 `CreatedAt`이 모두 0이 아닐 때 적용)을 넘겼다면 tinyauth는 삭제를 시도하고 인증 오류를 반환한다. 반면 아직 유효하다면 **갱신 임계값(threshold)**을 확인한다. 임계값은 `SessionExpiry`가 3600초 이하이면 정수 나눗셈으로 절반, 3600초를 넘으면 3600초로 계산되며, 남은 시간이 임계값 이하일 때 기존 `expiry`에 임계값을 더한다. (단, 로컬 TOTP 대기 중인 세션은 이 일반 갱신 경로 전에 반환된다. [세션 갱신·조회 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L416-L520))

:::example 120초 세션이 연장되는 시점과 연장되지 않는 시점
`SessionExpiry=120`초(초기 만료 `t=120`)인 일반 세션을 가정하자. `120 <= 3600`이므로 갱신 임계값은 절반인 **60초**다.

| 요청 시점 | DB 만료 시각 변화 | 인증 응답 변화 |
|---|---|---|
| `t=40` (잔여 80초) | `120초` 그대로 유지 | 잔여가 60초보다 많으므로 새 쿠키 없음 |
| `t=70` (잔여 50초) | `120 + 60 = 180초`로 연장 | 갱신 성공 시 같은 UUID와 늘어난 수명의 `Set-Cookie` 발급 |
:::

:::warn DB는 연장됐는데 브라우저 쿠키가 갱신되지 않는 함정
tinyauth는 갱신된 `Set-Cookie`를 **인증 서브요청 응답**에 찍어 보낸다. 그런데 Traefik v3.6.2는 `addAuthCookiesToResponse` 목록에 지정된 쿠키 이름만 브라우저에게 가는 최종 응답으로 복사해 준다. ([Traefik 쿠키 전달 코드](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L290-L331)) 이 설정이 빠지면 DB 수명은 180초로 늘었는데 브라우저 쿠키는 원래 시각인 120초에 만료되어 사라지는 엇갈림이 생긴다.
:::

## 로그아웃 뒤 브라우저와 DB를 따로 확인해야 하는 이유

tinyauth의 `DeleteSession`은 로그아웃 시 DB에서 세션 삭제를 시도하다가 오류가 나더라도, 오류를 로그에 남긴 채 **삭제용 쿠키(`MaxAge: -1`)를 정상 반환**한다. ([tinyauth 로그아웃 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/user_controller.go#L241-L288)) 그래서 핸들러가 `200`과 `Set-Cookie`를 보내면 브라우저에서는 쿠키가 지워져 로그인 화면이 뜨지만, DB에는 여전히 그 UUID 레코드가 살아 있을 수 있다.

:::steps 로그아웃 검증 시 확인할 2가지
1. 브라우저에서 보호 경로를 다시 열어 쿠키가 사라졌고 로그인 화면이 나오는지 확인한다.
2. DB에서 종료하려던 세션 UUID의 레코드가 실제로 삭제되었는지 별도로 조회한다. (레코드가 남아 있다면 같은 UUID를 다시 실어 보냈을 때 다른 차단 경로가 없는 한 인증이 통과할 수 있다.)
:::

:::compare DB 세션 vs 서명·만료만 보는 JWT
### DB 세션 (tinyauth 방식)

매 요청 또는 조회 시 서버 DB의 세션 레코드를 보고 만료를 판단한다. DB의 `expiry` 컬럼을 늘려 수명을 연장할 수 있고, DB에서 레코드를 지우면 같은 UUID는 즉시 무효화된다.

### 서명·만료만 검사하는 JWT

만료 시각(`exp`)이 토큰 자체에 박혀 있다. 수명을 늘리려면 새 토큰을 다시 발급해야 하며, 검증기가 별도 폐기 목록(블랙리스트 등)을 조회하지 않는 한 브라우저가 쿠키를 지워도 이미 발급된 유효 JWT는 만료 전까지 그대로 통과한다. ([RFC 7519 JWT 검증 절차](https://www.rfc-editor.org/rfc/rfc7519.html#section-7.2))
:::

:::quiz
로그아웃 응답으로 `200`을 받았고 보호 페이지에 다시 접속하니 로그인 화면이 나온다. 그런데 DB를 조회해 보니 기존 세션 UUID의 유효한 레코드가 그대로 남아 있다. 현재 상태를 가장 정확하게 설명한 것은?
- [x] 브라우저의 접근은 끊겼지만 서버 DB 세션은 아직 폐기되지 않았다
  Feedback: 로그인 화면이 뜬 것은 브라우저 쿠키가 지워졌기 때문이고, DB에 레코드가 살아 있으므로 서버 측 세션 폐기는 완료되지 않은 상태다.
- [ ] 재방문이 막혔으므로 DB 폐기도 성공한 것이다
  Feedback: 브라우저가 쿠키를 지워 보내지 않았을 뿐, 서버 레코드가 남아 있다면 누군가 그 UUID를 다시 제시할 때 유효할 수 있다.
- [ ] DB 레코드가 살아 있으므로 브라우저도 여전히 로그인 상태다
  Feedback: 서버에 레코드가 남아 있어도 브라우저가 쿠키를 삭제해 전송하지 않으면 브라우저는 미인증 상태가 된다.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[tinyauth auth_service.go 세션 관리 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L416-L520)에서 갱신(`newExpiry`), 로그아웃(`DeleteSession`), 조회(`GetSession`) 세 함수가 만료와 삭제를 어떻게 다루는지 비교해 보자.
:::

:::ask
Teach Session에서 DB의 `expiry`는 연장됐는데 브라우저 쿠키는 원래 만료 시각에 사라진 장애 사례를 놓고, 4개의 관찰 지점(DB 갱신·인증 응답·최종 응답·브라우저 저장소)으로 원인을 좁혀 보자.
:::
