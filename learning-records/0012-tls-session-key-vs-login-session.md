# TLS session key와 로그인 session 구분

사용자는 TLS 설명의 `session key`가 로그인 세션, 세션 ID, 서버 session 객체와 같은 것인지 확인했다. 앞으로는 TLS session key를 “TLS 연결 동안만 쓰는 임시 대칭키 계열”로 명확히 말하고, 웹 로그인 세션과는 별개라고 먼저 분리해 설명해야 한다.
