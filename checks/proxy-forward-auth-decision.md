# proxy-forward-auth-decision: 인증 서비스의 응답을 보고 proxy의 최종 응답과 보호 앱 도달 여부를 예측한다

Version: 1
Task: 브라우저가 보호된 `/invoices`를 열었어. Traefik은 기본 ForwardAuth 계약을 따르고 있고, 인증 서비스가 이 요청에 `302`와 `Location: https://accounts.example.com/denied`를 줬어. 원 요청은 앱에 도달해? 브라우저는 무엇을 받고 어디로 가? 인증 서브요청이 똑같은 `302`를 주는데 proxy가 Nginx의 기본 `auth_request`라면 어떤 결과가 나와? 마지막으로 인증 서비스가 대신 `204`를 주면 두 proxy가 각각 접근을 허용할지도 말해 줘.
Pass when: (1) Traefik에서 원 요청은 앱에 도달하지 않고 브라우저는 `302`와 `Location`을 받아 `/denied`로 새 요청을 보낸다. (2) Nginx `auth_request`는 `302`를 오류로 취급하여 원 요청을 앱에 보내지 않고 인증 서비스의 이동 응답도 전달하지 않는다. (3) `204`는 `2xx`라 두 proxy가 접근을 허용한다. [Traefik ForwardAuth](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/forwardauth/) · [Nginx auth_request](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html) · [RFC 9110 §15.4.3](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.3)
Also accept: “차단 후 거부 화면으로 이동”, “Nginx는 인증 서브요청 오류”처럼 같은 동작을 뜻하는 표현. Nginx 오류의 최종 상태 코드 번호나 앱이 자체 반환하는 상태 코드는 요구하지 않는다.
Aids allowed: none
