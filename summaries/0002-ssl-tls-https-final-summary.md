# SSL/TLS와 HTTPS 최종 정리

이 정리는 SSL/TLS, HTTPS, 인증서, session key, Let’s Encrypt, OSI 계층 혼동을 하나의 멘탈 모델로 묶은 최종 요약이다.

관련 자료:

- [Lesson 0008: HTTP가 HTTPS가 될 때 TLS와 인증서가 하는 일](../lessons/0008-http-https-tls-ssl-certificate.html)
- [Lesson 0009: 브라우저에서 HTTPS 요청이 서버까지 가는 계층 흐름](../lessons/0009-browser-https-layer-flow.html)
- [Reference 0004: HTTPS/TLS/SSL 인증서 치트시트](../reference/0004-https-tls-ssl-certificate-cheatsheet.html)
- [Learning Record 0009](../learning-records/0009-https-tls-certificate-question-baseline.md)
- [Learning Record 0010](../learning-records/0010-https-layer-and-key-exchange-mental-model.md)
- [Learning Record 0011](../learning-records/0011-osi-and-tls-layer-placement.md)
- [Learning Record 0012](../learning-records/0012-tls-session-key-vs-login-session.md)
- [Learning Record 0013](../learning-records/0013-certificate-shape-and-session-key-bytes.md)

공식 근거:

- [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
- [RFC 5280: X.509 Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280.html)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)
- [MDN: HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
- [MDN: TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS)
- [MDN: HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
- [Let’s Encrypt: How It Works](https://letsencrypt.org/how-it-works/)

## 1. 최종 한 문장

HTTPS는 HTTP를 다른 형식으로 바꾸는 것이 아니라, HTTP 메시지를 TLS 보안 연결 안에 넣어 보내는 방식이다.

```text
HTTPS = HTTP over TLS
```

TLS는 다음을 제공한다.

```text
기밀성       중간에서 내용을 읽기 어렵게 함
무결성       중간에서 내용을 바꾸면 탐지 가능
서버 인증    내가 진짜 해당 도메인 서버와 통신하는지 확인
```

## 2. SSL과 TLS

`TLS`는 `Transport Layer Security`의 줄임말이다.

실무에서 “SSL 인증서”라고 많이 부르지만, 현대 HTTPS는 보통 TLS를 쓴다. SSL은 오래된 이름이고, 정확한 표현은 TLS 인증서 또는 X.509 서버 인증서다.

```text
SSL = 오래된 프로토콜 이름
TLS = 현대 HTTPS에서 쓰는 보안 프로토콜
```

## 3. 브라우저가 `https://api.example.com/users`를 처리하는 흐름

`https://`는 “HTTP를 나중에 HTTPS로 바꾸라”는 뜻이 아니다.

브라우저가 URL scheme을 보고 처음부터 TLS 연결을 선택한다.

```text
https://api.example.com/users
-> DNS로 IP 찾기
-> TCP 443 연결
-> TLS handshake
-> HTTP 메시지 생성
-> HTTP 메시지를 TLS record 안에 암호화
-> 서버 전송
```

서버에서는 반대로 올라온다.

```text
네트워크 bytes 수신
-> TCP
-> TLS 복호화
-> HTTP 메시지 복원
-> 서버 application 처리
```

## 4. OSI 계층으로 보는 정확한 감각

“L7끼리 통신한다”는 말은 논리 view다.

```text
Browser HTTP <-> Server HTTP
Browser TLS  <-> Server TLS
Browser TCP  <-> Server TCP
```

실제 byte 흐름은 아래다.

```text
client L7 -> L1 -> network -> server L1 -> L7
```

TLS는 OSI 7계층에 딱 하나로 들어맞지 않는다. 실무에서는 이렇게 보면 된다.

```text
HTTP
TLS
TCP
IP
Link/Physical
```

즉 TLS는 TCP 위, HTTP 아래의 보안 layer다. 순수 L4도 아니고 순수 L7도 아니다.

## 5. HTTP에서 HTTPS로 “전환”한다는 말의 정확한 의미

두 상황을 구분해야 한다.

```text
https://로 처음 요청
-> 처음부터 TLS 연결 사용

http://로 요청
-> 서버가 301/308 redirect로 https:// 위치 알려줌
-> 브라우저가 새 HTTPS 요청 시작
```

주의:

```text
HTTP redirect의 첫 요청은 평문일 수 있음
```

HSTS는 이 약점을 줄인다.

```text
Strict-Transport-Security
-> 브라우저가 이후 HTTP 요청을 보내기 전에 HTTPS로 바꿈
```

## 6. TLS handshake가 하는 일

TLS handshake는 “앞으로 이 연결에서 안전하게 통신할 준비”다.

큰 흐름:

```text
1. 브라우저가 TLS 버전, 암호 스위트, 랜덤값, 서버명 등을 제안
2. 서버가 인증서와 key exchange 재료를 보냄
3. 브라우저가 인증서 검증
4. 브라우저와 서버가 같은 session key 계열 계산
5. 이후 HTTP 데이터를 그 key로 암호화
```

매 HTTP 요청마다 full handshake를 새로 하지 않는다. 같은 origin 연결은 재사용될 수 있다.

```text
처음:
  TCP 연결
  TLS handshake
  GET /me

같은 연결 재사용:
  GET /orders
  POST /cart
```

HTTP/2에서는 한 TLS 연결 위에서 여러 HTTP stream을 multiplex할 수 있다.

## 7. 대칭키와 비대칭키 관계

대칭키 암호화는 빠르다. 문제는 “그 대칭키를 어떻게 둘만 알게 하느냐”다.

TLS는 이 문제를 key exchange로 푼다.

옛날식 단순 비유:

```text
서버 공개키로 대칭키를 암호화해서 전달
-> 서버 개인키로 복호화
-> 둘이 같은 대칭키 사용
```

현대 TLS 1.3에 더 가까운 감각:

```text
ephemeral Diffie-Hellman 재료 교환
-> 네트워크에 session key 자체는 안 보냄
-> 브라우저와 서버가 같은 key를 각자 계산
```

따라서 “비대칭키 방식으로 대칭키 문제를 해결하고, 실제 데이터는 빠른 대칭키로 보호한다”는 큰 이해는 맞다. 단, 현대 TLS에서는 대칭키를 그대로 보내는 게 아니라 양쪽이 계산한다.

## 8. Session key란?

여기서 `session key`는 로그인 세션 ID가 아니다.

아님:

```text
JSESSIONID 아님
JWT 아님
로그인 session id 아님
서버 DB의 사용자 session 아님
```

뜻:

```text
TLS 연결 동안만 쓰는 임시 대칭키 계열
HTTP request/response 암호화/복호화에 사용
연결이 끝나면 버려짐
```

TLS 1.3에서는 더 정확히 여러 traffic secret/key가 파생된다.

```text
client write traffic key
server write traffic key
```

수업에서는 이 묶음을 쉽게 `session key`라고 불렀다.

형태:

```text
사람이 정한 문자열 아님
암호 알고리즘에 들어가는 랜덤 bytes
디버깅 출력에서는 hex 문자열처럼 보일 수 있음
네트워크에 그대로 보내지 않음
```

예쁘게 출력하면 이런 느낌이다.

```text
7f 4a 91 0c 2b ...
7f4a910c2b...
```

## 9. HTTPS에서 어디까지 암호화되는가?

TLS 연결이 만들어진 뒤 HTTP 메시지는 거의 통째로 보호된다.

암호화됨:

```text
HTTP method/path/query
HTTP headers
Cookie
Authorization
request body
response headers
response body
```

노출될 수 있음:

```text
서버 IP
port
DNS 질의 도메인, 별도 보호 없을 때
SNI 서버명, ECH 없을 때
통신 시각
통신 크기
통신 빈도
```

즉 HTTPS는 HTTP 내용 보호에 강하지만, 모든 네트워크 메타데이터를 완전히 숨기지는 않는다.

## 10. SSL/TLS 인증서란?

인증서는 데이터를 직접 암호화/복호화하는 물건이 아니다.

인증서 역할:

```text
이 공개키가 이 도메인 서버 것임을 CA가 서명해 보증
```

브라우저가 확인하는 것:

```text
접속 hostname이 인증서 SAN에 포함되는가?
신뢰 가능한 CA chain으로 이어지는가?
유효 기간 안인가?
서버 인증용 인증서인가?
서버가 private key를 실제로 소유했는가?
```

인증서가 도와주는 것:

```text
잘못된 중간자와 session key를 만들 위험 감소
```

## 11. 인증서 파일 형태

인증서의 표준 구조는 X.509 certificate다.

파일 확장자:

```text
.crt
.cer
.pem
```

인코딩:

```text
DER = 바이너리 ASN.1 인코딩
PEM = DER bytes를 Base64 텍스트로 감싼 형태
```

PEM 예:

```text
-----BEGIN CERTIFICATE-----
MIIF...
...base64...
-----END CERTIFICATE-----
```

이 가운데 Base64를 디코딩하면 DER 바이너리가 나온다. 바로 JSON처럼 사람이 읽히는 구조가 아니다. ASN.1/X.509 parser가 필요하다.

```text
PEM text
-> Base64 decode
-> DER binary bytes
-> ASN.1/X.509 parse
-> 인증서 필드 확인
```

확인 명령:

```bash
openssl x509 -in cert.pem -text -noout
```

## 12. 인증서 안에 들어가는 데이터

주요 필드:

```text
version
  X.509 버전

serial number
  CA가 부여한 인증서 번호

issuer
  발급 CA

subject
  인증서 대상

subject alternative name(SAN)
  실제 도메인 목록
  hostname 검증의 핵심

validity
  notBefore / notAfter

subject public key info
  서버 공개키 + 알고리즘

key usage / extended key usage
  서버 인증 등 사용 목적

signature algorithm
  CA 서명 알고리즘

signature value
  CA 디지털 서명값
```

핵심:

```text
인증서 = 도메인 + 공개키 + CA 서명 + 유효기간 + 용도
```

## 13. Let’s Encrypt란?

Let’s Encrypt는 무료, 자동화, 공개 Certificate Authority(CA)다.

아님:

```text
HTTPS 프로토콜 아님
암호화 알고리즘 아님
요청 데이터를 직접 암복호화하지 않음
```

역할:

```text
도메인을 제어한다는 사실 확인
브라우저가 신뢰할 수 있는 TLS 인증서 발급
인증서 자동 갱신 지원
```

흐름:

```text
ACME client 실행
-> CA가 domain validation challenge 발급
-> 서버가 DNS record 또는 HTTP well-known path로 증명
-> CA가 challenge 확인
-> 성공하면 TLS 인증서 발급
-> 서버가 HTTPS handshake 때 인증서 제시
```

구분:

```text
Let’s Encrypt -> 인증서 발급/갱신
TLS handshake -> 인증서 검증 + session key 생성
session key -> HTTP 데이터 암호화/복호화
```

## 14. 이해가 바뀐 순서

처음 질문은 “HTTP 보안을 위해 HTTPS가 권장되는데, HTTP가 HTTPS로 전환되는 과정에서 TLS/SSL이 무엇을 하느냐”였다.

처음 헷갈릴 수 있었던 지점:

```text
HTTP가 HTTPS로 변환되는가?
인증서가 데이터를 직접 암복호화하는가?
TLS가 L4인가 L7인가?
session key가 로그인 session인가?
인증서 PEM 안의 Base64가 곧 사람이 읽는 정보인가?
```

최종 멘탈 모델:

```text
https:// scheme
-> 브라우저가 TLS 연결 선택
-> 인증서로 서버 신원 확인
-> key exchange로 임시 session key 계열 계산
-> HTTP 메시지를 TLS 안에서 암호화 전송
-> 서버가 TLS 복호화 후 HTTP 처리
```

## 15. 실무 체크리스트

HTTPS 요청 흐름 확인:

```text
URL scheme이 https인가?
443 포트로 연결되는가?
TLS handshake가 성공하는가?
서버 인증서 hostname이 맞는가?
인증서 chain이 신뢰 가능한 CA로 이어지는가?
인증서 유효기간이 남았는가?
HTTP redirect만 믿고 있지 않은가?
HSTS가 필요한 서비스인가?
```

인증서 확인:

```bash
openssl x509 -in cert.pem -text -noout
```

서버 TLS 확인:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

HTTP에서 HTTPS redirect 확인:

```bash
curl -I http://example.com
curl -I https://example.com
```

HSTS 확인:

```bash
curl -I https://example.com | grep -i strict-transport-security
```

## 16. 마지막 압축

```text
HTTPS = HTTP over TLS
TLS = 인증 + key exchange + 암호화된 전송
인증서 = 도메인과 공개키에 대한 CA 서명 보증서
session key = TLS 연결에서만 쓰는 임시 대칭키 계열
Let’s Encrypt = 무료 자동 CA
PEM 인증서 = DER 바이너리를 Base64 텍스트로 감싼 것
```
