# Learning Vault Resources

## Git Knowledge

- [Pro Git: Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
  Git 공식 책의 rebase 장. Use for: rebase가 커밋을 재적용하는 방식, 공개된 커밋을 rebase하면 안 되는 이유.
- [git-rebase manual](https://git-scm.com/docs/git-rebase)
  Git 공식 rebase 명령어 문서. Use for: `--onto`, `--interactive`, `--rebase-merges`, conflict 처리 옵션 확인.
- [git-push manual](https://git-scm.com/docs/git-push)
  Git 공식 push 명령어 문서. Use for: `--force-with-lease`, upstream 설정, 안전한 강제 push 의미 확인.
- [git-pull manual](https://git-scm.com/docs/git-pull)
  Git 공식 pull 명령어 문서. Use for: `pull --rebase`, fetch 후 통합 방식 선택 확인.

## Auth Knowledge

- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
  OAuth2 표준 문서. Use for: 역할, authorization code grant, `state`, token endpoint 흐름 확인.
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
  OAuth2 최신 보안 권고. Use for: implicit flow 회피, PKCE, `state`/CSRF 방어 기준 확인.
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636.html)
  PKCE 표준 문서. Use for: authorization code 탈취 방어, `code_verifier`, `code_challenge` 흐름 확인.
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
  OAuth2 위에서 로그인 인증을 다루는 OIDC 핵심 명세. Use for: ID Token, `sub`, `nonce`, 토큰 검증 기준 확인.
- [Google: Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
  Google OAuth2 웹 서버 구현 문서. Use for: 구글 authorization URL, callback, code 교환, `state` 처리 확인.
- [Google: Verify the Google ID token on your server side](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
  Google ID Token 서버 검증 문서. Use for: Google 공개키/JWKS, `aud`, `iss`, `exp`, `sub` 검증 기준 확인.
- [React: useEffect](https://react.dev/reference/react/useEffect)
  React 공식 Hook 문서. Use for: 앱 시작 시 외부 시스템인 인증 API와 동기화하는 패턴 확인.
- [React: createContext](https://react.dev/reference/react/createContext)
  React 공식 Context 생성 문서. Use for: 인증 상태를 앱 전체에 전달하는 Provider 구조 확인.
- [React: useContext](https://react.dev/reference/react/useContext)
  React 공식 Context 소비 문서. Use for: Header, route guard 등에서 인증 상태를 읽는 방식 확인.
- [MDN: Request credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
  Fetch credentials 옵션 문서. Use for: cross-origin 요청에서 쿠키를 포함하는 `credentials: "include"` 의미 확인.
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
  HTTP 쿠키 설정 헤더 문서. Use for: `HttpOnly`, `Secure`, `SameSite`, `Max-Age`, `Path` 동작 확인.

## React Hooks Knowledge

- [React: useEffect](https://react.dev/reference/react/useEffect)
  React 공식 Hook 문서. Use for: 외부 시스템과 동기화하는 Effect의 목적, dependency, cleanup 기준 확인.
- [React: useRef](https://react.dev/reference/react/useRef)
  React 공식 Hook 문서. Use for: 렌더링에 필요 없는 값 보관, DOM ref, `current` 변경이 re-render를 만들지 않는다는 기준 확인.
- [React: useMemo](https://react.dev/reference/react/useMemo)
  React 공식 Hook 문서. Use for: 계산 결과 캐시, dependency 기준 재계산, 성능 최적화로만 의존해야 한다는 기준 확인.
- [React: useCallback](https://react.dev/reference/react/useCallback)
  React 공식 Hook 문서. Use for: 함수 참조 캐시, `memo`된 자식 컴포넌트 최적화, `useMemo`와의 차이 확인.
- [React: useReducer](https://react.dev/reference/react/useReducer)
  React 공식 Hook 문서. Use for: reducer/action 기반 상태 변경, dispatch, reducer 순수성 기준 확인.

## Web Security Knowledge

- [OWASP: Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
  CSRF 방어 공식 치트시트. Use for: synchronizer token pattern, double-submit cookie, custom header, SameSite, Origin/Referer 검증 기준 확인.
- [MDN: Cross-site request forgery](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)
  브라우저 관점의 CSRF 개념 문서. Use for: 쿠키 자동 첨부, state-changing request, form 기반 공격 예시, SameSite의 한계 확인.
- [Spring Security: Cross Site Request Forgery](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
  Spring Security CSRF 공식 문서. Use for: 기본 CSRF 보호, `CookieCsrfTokenRepository`, `XSRF-TOKEN`, `X-XSRF-TOKEN`, SPA 연동 기준 확인.
- [RFC 5280: Internet X.509 Public Key Infrastructure Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280.html)
  X.509 인증서 표준 문서. Use for: 인증서 필드, Subject, Issuer, Validity, Subject Public Key Info, Extensions, 인증 경로 검증 확인.
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
  HTTP 의미론 표준 문서. Use for: HTTP가 application-level protocol이고 `http`/`https` URI scheme이 어떻게 구분되는지 확인.
- [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)
  HTTP/2 표준 문서. Use for: 하나의 연결 위에서 여러 HTTP stream을 multiplex하는 구조 확인.
- [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
  TLS 1.3 표준 문서. Use for: TLS가 제공하는 보안 채널, handshake, key exchange, application data 보호 기준 확인.
- [MDN: HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
  HTTPS 개념 문서. Use for: HTTPS가 HTTP를 TLS로 암호화한 버전이라는 기본 정의 확인.
- [MDN: Transport Layer Security](https://developer.mozilla.org/en-US/docs/Glossary/TLS)
  TLS 개념 문서. Use for: TLS가 SSL을 대체한 프로토콜이며 웹 통신 보안에 쓰인다는 용어 정리 확인.
- [MDN: Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
  HSTS 헤더 문서. Use for: 브라우저가 이후 요청을 HTTPS로 강제하게 만드는 방식 확인.
- [Let's Encrypt: How It Works](https://letsencrypt.org/how-it-works/)
  공개 CA인 Let's Encrypt의 인증서 발급 흐름 설명. Use for: 도메인 검증, 인증서 발급, 자동 갱신의 큰 흐름 확인.

## Wisdom (Communities)

- [Stack Overflow: git tag](https://stackoverflow.com/questions/tagged/git)
  실무에서 자주 터지는 Git 상황별 질문이 많다. Use for: 에러 메시지와 복구 절차를 실제 사례로 확인.
- [GitHub Community: GitHub and Git](https://github.com/orgs/community/discussions/categories/github-and-git)
  GitHub 기반 협업 흐름 질문이 많다. Use for: PR, protected branch, fork workflow 관련 실무 감각 확인.
