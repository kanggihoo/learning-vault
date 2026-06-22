# OSI 모델에서 TLS 위치 혼동 보정

사용자는 `https://` URL이 application layer 정보라는 점과 TLS가 그 아래에서 동작한다는 점 사이의 관계를 질문했다. 이번 보정의 핵심은 “L7끼리 통신한다”는 말은 논리 view이고, 실제 byte 흐름은 송신 측 L7에서 L1로 내려간 뒤 수신 측 L1에서 L7로 올라오며, TLS는 TCP 위 HTTP 아래의 보안 layer로 보는 것이 가장 실용적이라는 점이다.
