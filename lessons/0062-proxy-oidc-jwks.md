# 선택 · ID Token의 서명을 어떤 키로 검증할까
Lang: ko
Target: 등록 callback부터 ID Token까지 따라가며 RP가 신뢰하는 issuer의 키를 고르고 검증할 항목을 짚는다.

:::recap
[0059 레슨](./0059-proxy-sso-scope.html)에서는 중앙 OP에서 로그인한 뒤 개별 앱(RP)이 자기 세션을 만드는 구조를 봤다. [PKCE 레슨](./0007-oauth2-fragment-implicit-flow-pkce.html)의 callback 흐름을 바탕으로, 이번에는 RP가 authorization code를 토큰으로 교환하고 ID Token의 RS256 서명을 검증할 때 **어떤 공개 키를 믿고 골라야 하는지** 살펴보자.
:::

:::key
RS256 서명을 직접 검증하는 RP는 토큰 안에 적힌 주소를 따라가 키를 가져오지 않는다. **미리 신뢰하도록 설정해 둔 `issuer`의 메타데이터(`jwks_uri`)**에서 공개 키 집합을 받아오고, 토큰 헤더의 `kid`로 후보 키를 찾아 서명과 클레임을 검사한다.
:::

:::terms
- Issuer: ID Token을 발급하는 OP의 고유 식별자(URL). 검증 시 기대한 값과 토큰의 `iss`가 일치해야 한다.
- JWK (JSON Web Key): 공개 키 같은 암호 키를 JSON 형식으로 표현한 객체.
- JWKS (JWK Set): `keys` 배열 안에 여러 JWK를 담아 제공하는 JSON 문서.
- kid (Key ID): JWKS 안에 여러 키가 있을 때, 이 토큰의 서명에 어떤 키가 쓰였는지 가리키는 식별자.
:::

:::iframe
[브라우저 callback, RP의 code 교환, JWKS 조회](../figures/0062-oidc-code-jwks-flow.html)
브라우저가 전달하는 authorization code와 RP 백엔드가 받아 검증하는 ID Token, 그리고 필요할 때 RP가 조회하는 JWKS 경로를 따라가 보자.
mode: archify
height: 760px
:::

:::steps Callback부터 ID Token 검증까지의 4단계
1. 브라우저를 거치는 인증 요청에 등록된 `redirect_uri`와 PKCE `S256` challenge를 실어 보내고, OP 인증이 끝나면 브라우저가 callback으로 `code`를 전달한다.
2. RP 백엔드가 token endpoint에 `code`, 같은 `redirect_uri`, `verifier`를 보내 교환을 요청하고, OP는 저장해 둔 challenge와 대조한다.
3. RP는 미리 신뢰하도록 지정한 `issuer`의 discovery 메타데이터에서 `issuer` 일치 여부와 `jwks_uri`를 확인한 뒤, RS256과 `kid`에 맞는 공개 키로 서명을 검증한다.
4. 서명이 통과하면 페이로드의 `iss`(기대 issuer), `aud`(자기 `client_id` 포함 여부), `exp`(만료 전), 그리고 요청에 보냈다면 `nonce` 일치 여부까지 확인한다.
:::

토큰 안에 들어 있는 값은 서명을 검증하기 전까지 믿을 수 없다. 따라서 검증에 쓸 키의 출처는 토큰 내부가 아니라 **RP가 처음부터 신뢰하기로 설정한 `issuer`와 그 메타데이터**에서 결정된다. ([OIDC Core ID Token 검증](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) · [OIDC Discovery 메타데이터](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata))

## tinyauth가 OIDC 발급자(OP)로 동작할 때

tinyauth를 OIDC 공급자로 쓸 때는 몇 가지 구현 특성을 알아두면 좋다.
- **엄격한 callback 대조**: authorization 요청의 `redirect_uri`가 등록값과 문자열 수준으로 정확히 일치해야 하며, 미등록 URI로는 오류 응답조차 돌려보내지 않는다. ([tinyauth OIDC 인가 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L402-L412))
- **1회용 code 선소비**: token endpoint에서는 해당 `client`의 `code`를 잠금 안에서 조회하자마자 바로 삭제(사용 처리)한 뒤 URI와 PKCE를 검사한다. 따라서 뒤이은 검사에서 거절되더라도 그 `code`는 이미 소모되어 재사용할 수 없다. ([tinyauth token 교환 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/oidc_controller.go#L570-L618))
- **JWKS 노출과 `kid`**: discovery 응답이 `jwks_uri`를 알려주고, JWKS endpoint가 공개 키 1개를 `keys` 배열로 내보낸다. tinyauth가 RS256으로 서명한 ID Token의 `kid`와 이 JWK의 `kid`는 같은 공개 키에서 생성된다. ([tinyauth JWKS 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/controller/well_known_controller.go#L56-L122))

:::example 캐시에 없는 새 kid가 들어왔을 때
RP의 로컬 캐시에는 `key-1`만 저장되어 있는데, 방금 받은 ID Token 헤더의 `kid`가 `key-2`라고 해 보자. 이때 RP는 토큰 안에 적힌 임의 URL로 가지 않고, 미리 신뢰해 둔 `issuer`의 `jwks_uri`를 다시 조회해 최신 키 집합을 받아온다. 새 목록에서 `key-2`를 찾으면 그 키로 서명을 검증하고, 갱신 후에도 `key-2`가 없으면 검증을 실패로 처리한다. ([OIDC Core 서명 키 교체](https://openid.net/specs/openid-connect-core-1_0.html#RotateSigKeys))
:::

:::compare 헷갈리기 쉬운 두 가지 Rotation
### Refresh token rotation (토큰 값 교체)

tinyauth의 refresh 성공 경로에서는 새 access token과 refresh token을 발급하고, OIDC 세션에 새 해시 값을 덮어쓴다. 여기서 바뀌는 대상은 **발급된 토큰 문자열** 자체다. ([tinyauth refresh 코드](https://github.com/tinyauthapp/tinyauth/blob/6dfdcf0/internal/service/oidc_service.go#L673-L742))

### Signing key rotation (서명 키 교체)

OP가 토큰 서명용 개인키를 바꿀 때 새 공개 키를 다른 `kid`와 함께 `jwks_uri`에 게시해 전환을 알리는 절차다. RP가 모르는 `kid`를 만났을 때 키 집합을 다시 가져오는 기준이 된다.
:::

:::warn
서명 검증을 마치기 전까지는 ID Token의 `iss`, `sub`, URL 등 페이로드 안의 어떤 값도 키를 고르거나 사용자를 믿는 근거로 삼아서는 안 된다.
:::

:::note
이 레슨의 도식과 절차는 OIDC 표준 흐름과 tinyauth 코드에서 정리한 내용이다. 작은 테스트 RP와 tinyauth 간의 실제 HTTP 교환 및 서명 검증은 구축 단계에서 확인한다.
:::

:::quiz
RP의 캐시에는 `key-1`만 있는데, 방금 받은 ID Token의 `kid`는 `key-2`다. RS256 서명을 검증하려면 어디서 키를 찾아야 할까?
- [ ] 토큰 페이로드가 가리키는 임의 URL에서 `key-2`를 받아온다
  Feedback: 서명을 검증하기 전 토큰 안의 URL은 공격자가 바꿀 수 있으므로 키 신뢰 근거로 쓸 수 없다.
- [ ] 캐시에 있는 `key-1`을 쓰고 만료(`exp`)만 확인한다
  Feedback: 만료 검사는 서명 검증을 대신할 수 없다. 서명에 실제로 쓰인 공개 키를 찾아 검증해야 한다.
- [x] 미리 설정한 `issuer`의 `jwks_uri`를 다시 조회해 `key-2`를 찾는다
  Feedback: 신뢰하는 `issuer`가 게시한 JWKS에서 `key-2`를 받아 서명과 클레임을 검사해야 하며, 갱신 뒤에도 없으면 거부해야 한다.
:::

[Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html) · [state와 ID Token 검증 기록](../learning-records/0004-oauth2-state-and-id-token-validation.md)

:::source
[OIDC Core §3.1.3.7 ID Token 검증 규칙](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation)에서 공개 키의 출처와 `iss`, `aud`, `exp`, 조건부 `nonce` 검사 순서를 차례로 확인해 보자.
:::

:::ask
Teach Session에서 callback의 `code`, token endpoint의 ID Token, JWKS의 공개 키 세 가지를 놓고, 각각 검증에 실패했을 때 흐름이 어느 지점에서 멈추는지 따라가 보자.
:::
