# Kafka 운영(Operations) 학습 범위 확정 — 2026-08-14

사용자가 `kafka/03-operations/` 번역본 md 9개(basic operations, geo-replication,
multi-tenancy, hardware and os, monitoring, kraft, tiered storage,
consumer rebalance protocol, transaction protocol, eligible leader replicas)를
직접 지정해 학습 자료 제작을 요청했다. 기존 [[MISSION.md]]의 카프카 미션은
"Out of scope: 실제 설치·운영 제외"였으나, 사용자의 명시적 요청으로 운영 관점
이해를 미션 범위에 추가했다(설치·구축 hands-on은 여전히 제외, "왜 그렇게 하는가"
수준까지만).

## 레슨을 6개로 재구성한 이유
9개 원문 파일을 그대로 1:1로 레슨화하면 얕은 파일(예: transaction protocol
36줄)이 난립해 working memory 원칙에 어긋난다. 그래서:

- **0020 운영 기초** — 01(basic operations, 742줄) 핵심 6~8개 + 06(hardware/os)
  요약 흡수. CLI 플래그 전체 나열은 제외.
- **0021 지리 복제 & 멀티테넌시** — 03 + 04. 핵심은 "offset이 클러스터 간에
  그대로 안 옮겨간다"는 초심자가 가장 헷갈리는 지점.
- **0022 KRaft 클러스터 운영** — 08. 기존 [[0018-kraft-vs-zookeeper]] 레슨과
  겹치지 않게 "무엇인가"는 스킵하고 "quorum을 어떻게 늘리고 줄이고 진단하는가"만.
- **0023 모니터링 핵심** — 07(888줄, 사실상 메트릭 나열)은 레슨에서 멘탈모델만
  가르치고, 전체 메트릭 목록은 새 레퍼런스 `reference/0011`로 분리(레슨=암기 X,
  레퍼런스=나중에 찾아보는 곳이라는 이 워크스페이스 철학을 그대로 적용).
- **0024 Tiered Storage** — 09. 독립된 개념이라 단독 레슨 유지.
- **0025 고급 프로토콜 3종 미리보기** — 10+11+12(총 154줄, 개별로는 너무 얇음).
  Rebalance/Transaction/ELR은 "지금 당장 필요 없는 심화 주제"로 명시적으로
  분류해 짧은 미리보기로만 다루고, 각각 기존 레슨(Static Membership, §6
  트랜잭션, Unclean Leader Election)과의 연결고리만 짚었다.

## 다음에 참고할 것
사용자가 실제로 프로토콜 내부 동작(rebalance wire sequence, transaction
coordinator 상세)이 궁금해지면 0025를 발판 삼아 심화 레슨을 새로 만들 것.
