# 선택 · ID Token의 서명을 어떤 키로 검증할까
Lang: ko
Target: 등록 callback부터 ID Token까지 따라가며 RP가 신뢰하는 issuer의 키를 고르고 검증할 항목을 짚는다.

:::recap
[0059](./0059-proxy-sso-scope.html)에서는 중앙 OP에서 로그인한 뒤 앱이 자기 세션을 만들었다. [PKCE 레슨](./0007-oauth2-fragment-implicit-flow-pkce.html)의 callback을 기준으로, 이번에는 OP가 code를 받고 토큰에 서명하는 쪽을 보자.
:::

:::key
RS256 서명을 직접 검사하는 RP는, 이미 신뢰하도록 설정한 issuer의 `jwks_uri`에서 얻은 공개 키를 사용한다. `kid`는 그 집합 안에서 후보를 찾는 표식이다.
:::

:::iframe
[브라우저 callback, RP의 code 교환, JWKS 조회](../figures/0062-oidc-code-jwks-flow.html)
브라우저가 옮기는 code와 RP 백엔드가 받는 ID Token을 각 화살표에서 찾자. RP는 필요할 때 키 집합을 조회한다.
mode: archify
height: 760px
:::

:::steps
1. 브라우저를 거치는 인증 요청에 등록한 redirect URI와 S256 challenge가 실린다. OP에서 인증이 끝나면 브라우저는 callback으로 code를 운반한다.
2. RP 백엔드가 token endpoint에서 code, 같은 redirect URI, verifier를 보내 교환한다. OP가 저장한 challenge를 verifier로 확인한다.
3. RP는 미리 정한 issuer에 대응하는 metadata의 issuer 값을 확인하고 jwks_uri를 읽는다. RS256과 kid에 맞는 공개 키로 서명을 확인한다.
4. RP는 iss가 기대한 issuer와 같은지, aud에 자기 client_id가 들어 있는지, exp 전인지, nonce를 보냈다면 일치하는지 확인한다.
:::

토큰 안의 값은 검증 전에 신뢰할 수 없다. 조회할 키의 출처는 RP가 신뢰하는 issuer와 그 metadata로 결정한다. 여기서는 서명을 직접 검사하는 구성의 핵심 경로를 추적한다. [OIDC Core §3.1.2.1, §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) · [ID Token 검증](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) · [OIDC Discovery §3, §4.3](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata) · [RFC 7636 §4](https://www.rfc-editor.org/rfc/rfc7636.html#section-4) · [RFC 7517 §4.5, §5](https://www.rfc-editor.org/rfc/rfc7517.html#section-4.5)

## tinyauth에서 이 역할을 맡는 코드

tinyauth는 authorization 요청의 callback을 등록값과 정확히 대조한다. token endpoint에서는 해당 client의 code를 잠금 안에서 조회해 삭제하고, 이어서 URI와 PKCE를 검사한다. 그러므로 그 뒤 검사에 실패해도 해당 code는 이미 소비된 상태다. [oidc_service.go:402–412,525–550 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L402-L412) · [code 소비](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L525-L550) · [oidc_controller.go:570–618](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/oidc_controller.go#L570-L618)

설정된 OP의 discovery 응답은 `jwks_uri`를 광고하고, JWKS endpoint는 공개 키 한 개를 `keys` 배열로 내보낸다. tinyauth가 RS256으로 서명한 ID Token의 `kid`와 이 JWK의 `kid`는 같은 공개 키에서 만든다. [well_known_controller.go:56–122 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/well_known_controller.go#L56-L122) · [oidc_service.go:552–588](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L552-L588) · [JWK 생성](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L867-L885)

:::compare
### Refresh token rotation

tinyauth의 refresh 성공 경로는 access·refresh token을 새로 만들고 OIDC 세션에 새 hash를 저장한다. 교체되는 대상은 토큰 값이다. [oidc_service.go:673–742 @6dfdcf0](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L673-L742)

### Signing key rotation

OP가 새 서명 키를 쓰면 다른 `kid`로 전환을 알릴 수 있다. RP는 모르는 `kid`를 만났을 때 신뢰한 `jwks_uri`로 돌아가 최신 집합을 가져온다. 이는 표준이 제시하는 키 교체 절차다. [OIDC Core §10.1.1](https://openid.net/specs/openid-connect-core-1_0.html#RotateSigKeys)
:::

:::quiz
RP의 캐시에 key-1만 있고 ID Token의 kid는 key-2다. RS256 서명을 검증하려면 어디를 볼까?
- [ ] token이 가리키는 임의 URL에서 key-2를 찾는다
  Feedback: 서명을 검사하기 전 token의 URL은 키를 신뢰할 근거가 될 수 없다.
- [ ] 캐시의 key-1을 선택하고 exp만 확인한다
  Feedback: 만료 검사는 서명 검증과 별개다. 서명에 맞는 공개 키를 찾아야 한다.
- [x] 설정한 issuer의 JWKS를 갱신하고 key-2를 찾는다
  Feedback: 신뢰한 issuer가 게시한 키로 서명과 클레임을 검사한다. 갱신 후에도 맞는 키가 없으면 이 경로로 검증할 수 없다.
:::

:::terms
- Issuer: ID Token을 발급하는 OP의 식별자. 검증에서는 기대한 issuer와 토큰의 iss를 대조한다.
- JWK: 암호 키를 표현하는 JSON 객체.
- JWKS: keys 배열로 JWK를 제공하는 JSON 문서.
- kid: 키 집합에서 서명에 쓰인 키 후보를 식별하는 값.
:::

도식은 표준 흐름이며 작은 RP와 tinyauth의 실제 교환은 미실행이다. [Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html) · [state와 ID Token 검증 기록](../learning-records/0004-oauth2-state-and-id-token-validation.md)

:::source
[OIDC Core §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation)에서 키의 출처와 `iss`, `aud`, `exp`, 조건부 `nonce` 검사를 차례로 찾아보자.
:::

:::ask
Teach Session에서 callback의 code, token endpoint의 ID Token, JWKS의 공개 키를 세 칸에 놓고 각 값이 실패하면 어디서 흐름이 멈추는지 살펴보자.
:::
