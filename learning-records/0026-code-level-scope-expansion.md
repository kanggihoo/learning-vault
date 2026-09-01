# 코드 레벨로 범위 확장 — 2026-09-01

첫 요청에서 사용자는 "코드로 설명하지는 말고 내부 동작에 대해서"라고 명시했다.
[[0024-websocket-stomp-mock-trading-baseline|0031]]과 [[0025-spring-messaging-vocabulary-and-cookie-auth|0032]]로
개념을 잡고 나자, **사용자가 먼저 코드 레벨 설명을 요청했다.** 미션 제약을 수정했다.

## 순서가 옳았다
"코드 금지 → 개념 확립 → 코드 요청"이라는 순서가 결과적으로 잘 맞았다. 0033의 코드를 처음부터
보여줬다면 `@MessageMapping`을 그냥 "HTTP 컨트롤러 비슷한 것"으로 외우고 끝났을 것이다.
채널·브로커·레지스트리를 먼저 알고 나서 설정 파일을 보니, `enableSimpleBroker()` 한 줄이
**"SimpleBrokerMessageHandler 빈을 만들어 clientInboundChannel과 brokerChannel에 등록한다"**로
읽힌다. 같은 코드가 완전히 다른 밀도로 읽히는 것.

**앞으로도 이 순서를 유지할 것:** 새 주제는 개념 → 어휘 → 코드 매핑 순서로.

## 0033에서 실제로 가르친 것
사용자가 가져온 자료(@MessageMapping도 컨트롤러다 / clientInboundChannel에서 prefix로 분기한다)는
정확했다. 여기에 **자료에 없던 세 가지**를 얹어 레슨의 중심으로 삼았다.

1. **`/app/chat/send`는 URL이 아니다** — 사용자가 "ws://chat/send 같이 노출되는 거냐"고 물었고
   실제로 헷갈리고 있었다. 엔드포인트 1개 vs destination N개 대조표를 §1에 먼저 놓았다.
   (0031 §2의 "엔드포인트를 종목별로 파는 게 아니다"와 같은 오해의 다른 얼굴)
2. **반환값이 만드는 차이** — 자료는 "void면 끝"까지만 말했다. void / 반환 / `@SendTo` /
   `@SendToUser` / `SimpMessagingTemplate` 5가지를 표로 정리하고,
   **어느 쪽을 쓰든 그다음 길(brokerChannel → 브로커 → outbound)은 같다**는 것을 강조했다.
   0031 §5의 틱 스케줄러와 정확히 같은 경로라는 연결이 이 레슨의 payoff.
3. **컨트롤러가 도는 스레드** — `clientInboundChannel` 워커다. 여기서 무거운 DB 조회를 하면
   남의 주문 접수까지 밀린다. 0032 §3(채널=스레드 풀)이 실무 규칙으로 바뀌는 지점.

## SimpleBroker 이름 정리
사용자가 "이전 그림의 토픽 장부가 SimpleBroker냐"고 확인해왔다. 맞다고 하되 한 겹 정확히 했다 —
**"SimpleBroker = 장부"가 아니라 "장부를 필드로 들고 있는 담당자"**다. 문서상 이름은 *Simple Broker*,
실제 클래스는 `SimpleBrokerMessageHandler`, 장부는 그 안의 `DefaultSubscriptionRegistry`.
비유↔실제 클래스 매핑표를 §3에 넣어 지금까지 쓴 비유("컨베이어 벨트", "구독 장부", "창구 직원")를
한 번에 정산했다. 비유를 오래 쓰면 이런 정산 절이 반드시 필요하다.

## 모의투자 도메인 연결
주문 예제에서 **왜 `@SendToUser`가 아니라 `SimpMessagingTemplate`인지**를 도메인 논리로 설명했다:
지정가 주문의 체결은 가상 시계가 그 가격에 닿아야 일어나므로 **메서드 리턴 시점에 결과가 없다.**
"접수됨"과 "체결됨"을 다른 시점에 보내야 하니 반환값으로는 불가능하다.
이게 틱 스케줄러가 같은 도구를 쓰는 이유와 정확히 같다.

## 다음 후보
가상 시계 스케줄러 코드 · `ChannelInterceptor`로 SUBSCRIBE 권한 검사 ·
`@MessageExceptionHandler`로 에러를 본인에게만 (`broadcast=false`).
