# Kafka 설정(Configuration) 학습 범위 확정 — 2026-08-14

사용자가 `kafka/04-configuration/` 번역본 md 7개(broker, topic, group, producer,
consumer-and-share-consumer, kafka-connect, admin configs)를 직접 지정해
[[0022-kafka-operations-scope-baseline|운영 아크(0020-0025)]]에 이어 학습 자료
제작을 요청했다.

## 레슨을 5개로 재구성한 이유
설정 문서 자체가 원문부터 "속성 이름 → 기본값 → 설명" 나열식 레퍼런스라서, 운영
아크의 0023(모니터링) 레슨에서 확립한 패턴을 그대로 반복했다: **레슨 = 멘탈모델
(카테고리 몇 개 + 그게 왜 중요한지), 레퍼런스 = 나중에 찾아보는 표**. 그래서 5개
레슨 각각에 대응하는 레퍼런스 치트시트를 하나씩 만들었다(reference/0012-0016).

- **0026 Broker & Topic 설정** — 01(3006줄!) + 02(310줄). 가장 큰 소스라 카테고리
  6개 정도로 극도로 추려냄. 핵심 프레임: "brokerConfig는 클러스터 기본값,
  topicConfig는 토픽별 예외"라는 하나의 관계로 두 파일을 묶었다.
- **0027 Consumer Group 설정** — 03(137줄, broker 쪽 한계값) + 05(896줄, client
  쪽 실제 설정 + Share Consumer). 0026과 같은 "브로커 쪽 한계 vs 클라이언트 쪽
  실제 값" 패턴이 반복된다는 걸 학습자가 알아채게 프레이밍.
- **0028 Producer 설정** — 04(887줄). [[0019-kafka-design-deep-dive]]에서 이미
  개념적으로 다 배운 것(acks, batch.size/linger.ms, idempotence, transaction)의
  실제 설정 이름 매핑 + 진짜 새로운 것(buffer.memory, max.in.flight와 순서 보장,
  delivery.timeout.ms vs request.timeout.ms)만 새로 가르침.
- **0029 Kafka Connect 설정** — 06(1364줄, 가장 큰 신규 개념). Connect 자체가
  아직 한 번도 안 배운 개념이라, 설정 이전에 "Connect가 뭔가" 짧은 프라이머를
  먼저 넣게 지시했다(distributed mode의 worker 조율이 Consumer Group과 같은
  원리라는 것, offset/config/status를 Kafka 토픽에 저장한다는 자기 참조 패턴).
- **0030 Admin Client 설정** — 08(716줄, 대부분 Producer/Consumer와 공통 설정과
  겹침). 의도적으로 가장 짧게, 겹치는 부분은 재설명 없이 0028을 참조하게 하고
  AdminClient만의 특이점(default.api.timeout.ms, 비멱등적 관리 작업의 재시도
  주의점)만 다루도록 지시. 설정 아크(0026-0030)의 마무리 레슨.

## 다음에 참고할 것
Kafka Connect의 아키텍처(커넥터 종류, 커스텀 커넥터 작성 등)를 더 깊이 알고
싶어지면 0029을 발판 삼아 별도 심화 레슨을 만들 것 — 이번엔 설정 레슨 안에
프라이머만 짧게 넣었을 뿐, Connect 자체는 아직 제대로 된 레슨이 없다.
