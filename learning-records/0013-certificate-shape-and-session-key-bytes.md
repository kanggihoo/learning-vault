# 인증서 형태와 TLS session key 물리적 모양 구분

사용자는 SSL/TLS 인증서를 발급받으면 실제로 어떤 데이터가 들어 있는지, session key가 긴 문자열 같은 것인지 질문했다. 앞으로는 인증서를 X.509 구조화 데이터(PEM/DER 인코딩)로, session key를 사람이 쓰는 문자열이 아니라 TLS handshake에서 계산되는 임시 랜덤 bytes/key material로 설명하면 된다.
