# Redis Streams Consumer Group 학습 기준점

Outbox 레슨(0013)에 이어, 발행된 메시지를 여러 Worker가 어떻게 분산 소비하고 장애를 회수하는지를 다루는 두 번째 레슨(0014)을 만들었다. 이 레슨에서 확립한 기준: Consumer Group은 "한 메시지는 한 Worker에게만 배달"이라는 분배 보장을 만들고, XREADGROUP의 `>`(새 메시지)과 `0`(내 pending) 구분, PEL(배달됐지만 XACK 안 된 목록), XACK가 PEL 제거의 유일한 수단이라는 점, 그리고 XAUTOCLAIM이 min-idle-time 임계값으로 죽은 Worker의 pending을 회수하며 delivery count를 증가시킨다는 점까지가 기준점이다. 이 모든 장치가 at-least-once를 만들고, 따라서 다음 레슨은 Consumer 멱등성(idempotency)으로 이어진다.
