# Mission: 협업 Git 실전 감각 만들기

## Why
실제 협업 환경에서 Git graph, merge, rebase, force push의 영향을 이해하고 팀원에게 피해를 주지 않는 방식으로 브랜치를 관리하고 싶다.

## Success looks like
- rebase를 써도 되는 상황과 피해야 하는 상황을 커밋 그래프로 설명할 수 있다.
- PR 작업 브랜치를 최신 main 위로 정리하고 안전하게 push할 수 있다.
- 협업에서 자주 쓰는 Git 명령어와 옵션을 목적별로 선택할 수 있다.

## Constraints
- 예시는 실제 협업 상황처럼 커밋 해시와 그래프를 함께 사용한다.
- 설명은 정확하고 명확하게, 한국어로 제공한다.

## Out of scope
- Git 내부 객체 모델 전체를 깊게 파고드는 내용은 지금은 제외한다.

---

# Mission: 분산 백엔드 아키텍처 개념 이해

## Why
실제 통합·AI 처리 아키텍처(PostgreSQL + Redis Streams + Outbox + Worker 분산)를 읽고,
각 컴포넌트가 왜 그렇게 구성됐는지, 장애 상황에서 어떻게 복구되는지를 설명할 수 있어야 한다.
구현이 아니라 "왜 이렇게 됐는지"를 이해·설명하는 것이 1차 목표다.

## Success looks like
- Dual-write 문제가 무엇인지, Outbox가 어떻게 하나의 트랜잭션으로 원자성을 만드는지 설명할 수 있다.
- Redis Streams의 Consumer Group, Pending, XACK, XAUTOCLAIM, DLQ가 장애 recovery에서 하는 역할을 말할 수 있다.
- At-least-once delivery와 멱등성, 재시도 상태 머신, lease 만료가 왜 함께 나오는지 설명할 수 있다.
- Webhook을 왜 "접수만" 하고 실제 처리는 비동기 작업으로 넘기는지 말할 수 있다.

## Constraints
- 설명은 정확하고 명확하게, 한국어로 제공한다.
- Sixmen 아키텍처 문서를 구체적 예시로 사용한다.
- 한 레슨은 한 개념 단위로, working memory 안에 들어오게 짧게 유지한다.

## Out of scope
- 실제 코드 구현·배포는 지금 단계에서 제외한다. 이해·설명 우선.

---

# Mission: 카프카 개념과 동작 원리 이해

## Why
백엔드 개발자로서 실제로 Kafka를 도입할 계획이 있다. 도입 전에 Kafka의 개념과 동작 원리를 제대로
이해해야, 실제 설계·운영 단계에서 잘못된 선택(파티션 설계, consumer group 구성, KRaft 클러스터
구성 등)을 하지 않을 수 있다.

## Success looks like
- Topic/Partition/Broker/Producer/Consumer/Replication의 역할과 관계를 그림으로 설명할 수 있다.
- Kafka가 실제로 어떤 문제(메시징, 로그 집계, 스트림 처리, 이벤트 소싱 등)에 쓰이는지 자신의
  도입 시나리오에 대입해 설명할 수 있다.
- 클러스터 metadata를 KRaft가 어떻게 관리하는지, ZooKeeper mode와 무엇이 다르고 왜 바뀌었는지
  설명할 수 있다.
- (향후) Consumer Group의 상세 동작(offset, rebalance)과 Producer의 전달 보장(acks, idempotence)을
  설명할 수 있다.
- 운영 관점에서 브로커 추가/제거, 파티션 재배치, graceful shutdown이 왜 필요한지 설명할 수 있다.
- 여러 클러스터를 쓰는 이유(geo-replication)와 한 클러스터를 여러 팀이 같이 쓸 때의 격리 방법
  (multi-tenancy: quota, ACL, 네임스페이스)을 설명할 수 있다.
- 무엇을 모니터링해야 장애를 가장 빨리 알아챌 수 있는지(핵심 지표 몇 가지) 설명할 수 있다.
- Broker/Topic/Consumer Group/Producer/Connect/Admin 설정 중 실제로 도입 판단에 영향을 주는
  핵심 설정 몇 가지를 카테고리별로 골라 설명할 수 있고, 어떤 설정 문서를 나중에 찾아봐야 할지 안다.

## Constraints
- Kafka는 처음 배우는 주제로, 사전 지식이 없다고 가정하고 시작한다.
- 이미 학습한 Redis Streams의 Consumer Group/PEL/XACK/XAUTOCLAIM 개념을 발판(analogy)으로
  적극 활용해 이해 속도를 높인다.
- 설명은 정확하고 명확하게, 한국어로 제공한다.

## Out of scope
- 실제 Kafka 클러스터를 직접 설치·구축하는 hands-on 실습과 코드 구현은 지금 단계에서 제외한다.
  다만 운영 상황을 판단하는 데 필요한 개념(브로커 추가/제거, KRaft quorum 구성, 모니터링 지표 등)은
  "왜 그렇게 하는가" 수준으로는 다룬다 — 2026-08-14, 사용자가 03-operations 자료 학습을 직접 요청.
- Consumer Rebalance Protocol/Transaction Protocol/Eligible Leader Replicas 같은 프로토콜
  내부(wire-level) 동작은 지금은 짧은 미리보기 수준까지만 다루고, 실제 필요해질 때 더 깊게 판다.
