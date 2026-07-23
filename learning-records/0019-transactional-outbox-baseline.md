# Transactional Outbox 학습 기준점

사용자가 Sixmen 통합·AI 처리 아키텍처(PostgreSQL + Redis Streams + Worker 분산)를 이해하기 위해 백엔드 개념 4개(Outbox / Streams Consumer Group / At-least-once+재시도 / Webhook 처리)를 배우기 시작했다. 미션은 "구현이 아니라 왜 그렇게 구성됐는지 설명할 수 있게 되는 것"으로 잡았고, 의존성 순으로 Outbox부터 진행한다.

이 레슨에서 확립한 기준: dual-write는 "DB와 브로커를 따로 쓸 때 찰나 실패로 한쪽만 바뀌는 불일치"이고, Outbox는 "발행할 메시지를 같은 DB 트랜잭션에 적어 원자성을 만드는 패턴"이다. 일반 트랜잭션이 외부 시스템 경계에 닿지 못해 Outbox가 필요하며, 2PC는 무거워 회피한다. Sixmen에서 `@Scheduled` polling은 실시간 실행 주체가 아니라 즉시 발행 실패 시 DB outbox에서 누락분을 회수하는 복구 안전망이라는 점, 그리고 Outbox가 at-least-once를 전제로 Consumer 멱등성을 요구한다는 점까지를 기준점으로 삼는다. 다음 레슨은 Redis Streams Consumer Group로 이어진다.
