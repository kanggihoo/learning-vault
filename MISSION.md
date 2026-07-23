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
- Kafka 도입 기준 등은 Redis Streams가 한계에 도달한 뒤 검토 대상이라 여기서는 깊게 다루지 않는다.
