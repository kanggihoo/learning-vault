# OAuth2 state와 ID Token 검증 기준

사용자는 OAuth2 callback의 `state`가 단순 전달값이 아니라 로그인 시작 요청과 callback 요청을 묶는 CSRF 방어 값이라는 점, 그리고 Google `id_token`은 JWT payload decode만으로 신뢰하면 안 되고 공개키 기반 서명과 `iss`, `aud`, `exp`, `nonce` 검증 후 `sub`를 사용해야 한다는 점을 질문했다. 앞으로 인증 Teach Session에서는 “decode”와 “verify”를 분리해서 설명해야 한다.
