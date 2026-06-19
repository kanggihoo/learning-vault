# OAuth2 쿠키 state와 프론트 복귀 흐름

사용자는 `state`가 Google authorization request에 포함되면 callback에도 같은 값으로 돌아온다는 점을 이해하기 시작했고, 서버 세션이 없을 때 쿠키가 callback 검증값 저장소처럼 쓰이는 구조를 질문했다. 또한 OAuth callback 이후 `302 Location`이 API가 아니라 프론트 라우트로 이동시키는 응답이며, 프론트가 부팅 후 `/auth/refresh` 또는 `/auth/exchange`를 명시적으로 호출해야 한다는 구분이 다음 인증 학습의 기준점이 되었다.
