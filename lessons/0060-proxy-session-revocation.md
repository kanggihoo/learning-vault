# 브라우저의 로그아웃과 DB 세션 폐기
Lang: ko
Target: DB 세션과 서명·만료만 검사하는 JWT의 갱신·만료·폐기 전후를 비교하고 확인할 값을 짚는다.

:::recap
[0059](./0059-proxy-sso-scope.html)에서 로그인 상태를 앱과 중앙으로 나눴다. 이번에는 중앙 tinyauth 세션 한 개를 브라우저의 cookie와 서버의 행으로 나눠 본다.
:::

:::key
같은 브라우저에서 로그아웃 후 보호 화면을 다시 열면 사용자가 보는 결과를 알 수 있다. 폐기 여부는 DB에서 같은 세션 UUID의 행을 조회해 확인한다.
:::

## 수명이 늘어나는 곳

tinyauth는 DB 세션의 UUID를 runtime 이름의 cookie 값으로 사용한다. 생성 시 `Path=/`, HttpOnly, SameSite=Lax를 지정하고 Secure는 설정을 따른다. 하위 도메인 기능이 켜졌을 때 runtime CookieDomain을 사용한다. [auth_service.go:362–413,673–678 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L362-L413) · [Domain 선택](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L673-L678)

초 단위로 `SessionExpiry=120`이고 정해진 만료가 `t=120`인 일반 세션을 생각하자. 갱신 임계값은 60초다. 잔여가 임계값 이하인 유효 세션은 기존 expiry에 임계값을 더한다. 설정이 3600초 이하이면 정수 나눗셈으로 절반, 그 이상이면 임계값은 3600초다. [auth_service.go:416–466 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L416-L466)

| 판정 시점 | DB 만료 | 인증 응답에서 볼 것 |
|---|---|---|
| `t=40`, 잔여 80초 | 120초 그대로 | 이 갱신 로직에서 새 cookie 없음 |
| `t=70`, 잔여 50초 | 120 + 60 = 180초 | 성공하면 같은 UUID와 연장된 수명의 `Set-Cookie` |

서버 조회는 현재 Unix 초가 expiry를 넘거나 설정된 최대 수명을 넘으면 삭제를 시도하고 오류를 반환한다. 최대 수명 비교는 설정값과 `CreatedAt`이 모두 0이 아닐 때 적용된다. local TOTP pending 세션은 middleware의 일반 갱신 경로 전에 반환된다. [auth_service.go:490–520 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L490-L520) · [context_middleware.go:151–167,244–250](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L151-L167) · [갱신 호출](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L244-L250)

:::warn
인증 서브요청의 `Set-Cookie`와 브라우저가 받는 최종 응답의 `Set-Cookie`를 따로 본다. Traefik v3.6.2의 성공 분기는 `addAuthCookiesToResponse`에 지정한 이름을 최종 응답에 복사한다. 브라우저가 그 값을 저장하는지도 외부 응답의 호스트와 cookie 조건에 맞춰 확인해야 한다. 이 전달·저장은 미실행이다. [tinyauth context_middleware.go:79–96 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L79-L96) · [Traefik forward.go:290–331 @v3.6.2](https://github.com/traefik/traefik/blob/v3.6.2/pkg/middlewares/auth/forward.go#L290-L331) · [RFC 6265 §5.3](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.3)
:::

## 로그아웃 뒤 관찰할 두 가지

:::steps
1. 브라우저에서 인증 필수 경로를 재방문해 cookie가 사라졌는지와 로그인이 다시 필요한지를 기록한다.
2. DB에서 종료하려던 UUID의 행이 남았는지를 별도로 기록한다. 서버 측 HTTP 판정 검증은 구축 단계의 통합 검사에 둔다.
:::

이 버전의 `DeleteSession`은 DB 삭제 오류를 로그에 남겨도 삭제용 cookie를 성공으로 반환한다. handler가 그 cookie와 200을 전송하므로, 브라우저에 로그인 화면이 나와도 DB 행이 남아 있을 수 있다. 행이 없다면 같은 UUID의 cookie 인증 조회는 실패한다. 최종 접근 예측은 다른 인증 수단과 IP bypass가 없는 보호 경로를 전제로 한다. [auth_service.go:470–498 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L470-L498) · [user_controller.go:241–288](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/user_controller.go#L241-L288) · [SQLite session_queries.sql.go:86–117](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/repository/sqlite/session_queries.sql.go#L86-L117) · [후속 인증 분기](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/middleware/context_middleware.go#L79-L149)

:::compare
### 이 DB 세션

조회할 때 서버 행에서 만료를 판단한다. 행의 expiry를 늘려 수명을 갱신하고, 삭제가 성공하면 같은 UUID로 조회할 세션이 사라진다.

### 서명·만료만 검사하는 JWT

이미 발급한 JWT의 `exp`는 토큰에 포함된다. 유효 기간을 늘리려면 새 토큰을 발급한다. 이 검증기에서 같은 키와 만료 전 토큰이 유효하다면 브라우저가 저장값을 삭제해도 토큰에 대한 판정은 바뀌지 않는다. 별도 폐기 상태를 검사하는 검증기는 그 상태를 반영할 수 있다. [RFC 7519 §4.1.4, §7.2](https://www.rfc-editor.org/rfc/rfc7519.html#section-4.1.4) · [검증 절차](https://www.rfc-editor.org/rfc/rfc7519.html#section-7.2)
:::

:::quiz
로그아웃은 200이고 재방문에서 로그인 화면이 보인다. DB에는 기존 UUID의 유효한 행이 남아 있다. 어떤 관찰 기록이 맞을까?
- [x] 브라우저의 접근은 끊겼고 서버 행은 남았다
  Feedback: 재방문 결과는 브라우저 상태를 보여 준다. DB 행 조회로 해당 UUID가 폐기되지 않았음을 따로 확인했다.
- [ ] 재방문이 막혔으므로 DB 폐기도 성공했다
  Feedback: cookie가 빠지면 살아 있는 행이 있어도 브라우저가 그 행을 가리키지 않는다.
- [ ] 행이 살아 있으므로 브라우저도 로그인 상태다
  Feedback: 살아 있는 행과 브라우저가 그 UUID를 보내는지는 별개의 조건이다.
:::

:::terms
- Sliding 갱신: 유효 세션이 사용되고 만료가 가까워졌을 때 서버가 만료 시점을 연장하는 방식.
- 세션 폐기: 만료 시점이 오기 전에 서버가 해당 세션을 더 이상 사용할 수 없게 만드는 변경.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[tinyauth auth_service.go:416–520 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/auth_service.go#L416-L520)에서 갱신의 `newExpiry`, 로그아웃의 `DeleteSession`, 조회의 `GetSession`을 대조하자.
:::

:::ask
Teach Session에서 DB expiry가 연장됐는데 브라우저 cookie는 원래 시각에 사라진 사례를 네 관측 지점으로 좁혀 보자.
:::
