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

## Wisdom (Communities)

- [Stack Overflow: git tag](https://stackoverflow.com/questions/tagged/git)
  실무에서 자주 터지는 Git 상황별 질문이 많다. Use for: 에러 메시지와 복구 절차를 실제 사례로 확인.
- [GitHub Community: GitHub and Git](https://github.com/orgs/community/discussions/categories/github-and-git)
  GitHub 기반 협업 흐름 질문이 많다. Use for: PR, protected branch, fork workflow 관련 실무 감각 확인.
