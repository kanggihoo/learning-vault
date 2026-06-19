# OAuth2 로그인 흐름 멘탈 모델 보정

사용자는 구글 로그인 흐름에서 callback, authorization code, 구글 토큰, 우리 서비스 JWT의 관계를 이미 대략 알고 있었지만, callback을 웹훅처럼 이해하거나 fragment 기반 토큰 전달을 현대 code flow와 섞어 생각하고 있었다. 앞으로 인증 주제를 다룰 때는 먼저 “브라우저 redirect 구간”과 “백엔드 서버 간 토큰 교환 구간”을 분리해서 설명하면 이해가 빠르다.
