# Spring 메시징 어휘 질문 + 인증 전제 수정 — 2026-09-01

[[0024-websocket-stomp-mock-trading-baseline|0031 레슨]] 직후 사용자가 다섯 가지를 되물었다.
전부 **"배관도에 나온 단어를 실제로는 모른다"**는 하나의 문제였다.

1. Spring `Message`가 뭔가?
2. `clientInboundChannel` / `brokerChannel` / `clientOutboundChannel`이 뭔 말인가?
3. 스케줄러는 어디로 보내는 건가? 브로커가 저장했다가 알아서 보내는 건가?
4. `SimpleBrokerMessageHandler`는 뭔가? Handler는 콜백 아닌가?
5. HTTP를 변환해서 WS 연결을 만드는 게 맞나?

## 판단: 0031을 고치지 않고 0032를 새로 만들었다
0031은 이미 크고, 이 다섯 질문은 **0031보다 앞에 와야 할 선행 어휘**다. 레슨 하나에
"흐름"과 "어휘"를 같이 넣으면 working memory를 넘긴다. 그래서 0032를 만들고 0031 서두에서
"흐릿하면 0032 먼저"로 연결했다. 순서상 0032 → 0031이지만 번호는 만들어진 순서를 따랐다.

## 사용자가 실제로 틀리게 알고 있던 것 두 가지
질문 3에 **명확한 오개념**이 있었다 — "보내준 거를 어딘가에 저장을 하고 있다가 ... 전달을 하는거 같은데".
**브로커는 메시지를 저장하지 않는다.** 오래 사는 것은 구독 목록뿐이고 메시지는 통과 후 GC된다.
이걸 0032 §4와 0031 §5에 각각 경고 박스로 못박고, 이미 배운 Kafka와 대비시켰다
(Kafka는 로그에 남겨 나중에 온 컨슈머도 과거를 읽는다 → STOMP는 그 순간 붙어 있는 구독자에게만).
이 대비가 0031 §4의 "스냅샷 공백"이 왜 존재하는지까지 한 번에 설명해준다.

또 하나 — "SimpleBrokerMessageHandler한테 보내면 바로 소켓에 보내는 느낌인가?"에 대해
**브로커는 소켓을 만지지 않는다**는 점을 분리했다. 브로커는 세션 ID 문자열만 알고,
소켓 쓰기는 `StompSubProtocolHandler`의 일이다. 이 분리 덕에 브로커가 WebSocket을 몰라도 된다.

반대로 질문 4("Handler는 콜백 아닌가")와 질문 5("HTTP를 변환해서 WS로")는 **맞는 직관**이었다.
맞다고 먼저 확인해주고, 각각 한 가지만 보정했다 — Handler는 *상태를 가진* 콜백이라는 것
(레지스트리를 필드로 들고 있다), 업그레이드는 *같은 TCP 연결*을 재사용한다는 것.

## 전제 수정: JWT → 세션 쿠키
사용자가 인증은 세션(쿠키) 방식이라고 알려줬다. 0031 §2에 JWT 기준으로 써둔 것을 고쳤다.
쿠키 방식이 오히려 **할 일이 없다** — 핸드셰이크가 진짜 HTTP 요청이라 Security 필터 체인을
그대로 통과하고, 거기서 나온 Principal이 WebSocket 세션에 영구 부착된다.

대신 쿠키 방식 고유의 함정 두 개를 새로 넣었다:
- **CSWSH**: WebSocket 핸드셰이크는 동일 출처 정책이 막아주지 않는다. 악성 사이트가 연 연결에도
  브라우저가 쿠키를 붙인다. CSRF 토큰도 무력(핸드셰이크에 실을 자리가 없음). → Origin 화이트리스트 필수.
  이미 배운 [[0016-csrf-cors-origin-mental-model]]의 "쿠키는 자동으로 붙는다"가 그대로 재현되는 것이라
  그 레슨으로 링크를 걸었다.
- **세션 만료 ≠ 소켓 종료**: HttpSession이 만료돼도 이미 열린 WebSocket은 계속 산다.

## 다음에 참고할 것
사용자가 "코드로 설명하지 말라"고 했지만, 어휘 레슨(0032)에서는 **인터페이스 정의 3줄**
(`Message`, `MessageChannel`, `MessageHandler`)을 보여주는 게 오히려 이해를 앞당겼다.
"코드 금지"는 *구현 예제 금지*이지 *타입 시그니처 금지*가 아니라고 해석했다. 이 구분을 유지할 것.

## 추가 (같은 날): 사용자가 직접 자료를 가져왔다
사용자가 "스프링 내부 채널은 WebSocket 기술이 아니라 `spring-messaging` 소속"이라는 설명을 어디선가
가져와 레슨에 넣어달라고 했다. **검증해보니 핵심 주장은 전부 맞았다** —
`Message`/`MessageChannel`/`SimpleBrokerMessageHandler`/`SimpMessagingTemplate`은 모두
`org.springframework.messaging.*` = spring-messaging.

다만 **한 군데 보정이 필요했다.** 가져온 자료는 "spring-websocket = 연결 맺고 글자 받아오기 /
spring-messaging = 파싱부터"로 나눴는데, **STOMP 파싱조차 spring-messaging의 것이다**
(`StompDecoder`/`StompEncoder`가 `…messaging.simp.stomp`에 있음 — javadoc으로 확인).
spring-websocket이 가진 것은 **어댑터**다: `StompSubProtocolHandler`와
`WebSocketAnnotationMethodMessageHandler`가 `org.springframework.web.socket.messaging`에 있고,
후자는 `SimpAnnotationMethodMessageHandler`(messaging)를 **상속**한다 —
"프로토콜 중립이 아래, WebSocket 특화가 위"라는 층이 상속 관계에 그대로 새겨져 있다.

이 보정을 넣으니 오히려 이 절의 결론이 강해졌다: **이 레슨은 WebSocket 지식이 아니라 스프링 메시징
지식이다.** 그래서 (1) SimpleBroker→RabbitMQ 릴레이 교체 시 컨트롤러가 안 바뀌고,
(2) WebSocket 없이 TCP STOMP도 되고, (3) Spring Integration에서도 같은 어휘가 통한다는
세 가지 실질적 결과로 마무리했다. 0032 §6 + 퀴즈 Q7 + 치트시트 §7.

**교훈:** 사용자가 외부 자료를 가져올 때는 그대로 붙이지 말고 패키지/모듈 같은 검증 가능한 사실을
javadoc으로 확인할 것. 이번엔 90%가 맞았지만, 틀린 10%가 하필 "그래서 무엇이 어디에 속하는가"라는
이 절의 핵심이었다.
