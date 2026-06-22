# HTTPS 계층과 key exchange 멘탈 모델 보정

사용자는 TLS를 “HTTP를 HTTPS로 바꾸는 변환”으로 볼 수 있는 지점에서, `https://` scheme이 처음부터 TLS 연결을 선택하고 그 안에 HTTP 메시지를 싣는 구조로 이해를 보정하고 있다. 또한 대칭키 암호화의 키 공유 문제와 인증서의 공개키 신뢰 보증 역할을 연결하기 시작했으므로, 이후 세션에서는 TLS handshake를 “인증 + key exchange + session key 생성”으로 압축해 설명할 수 있다.
