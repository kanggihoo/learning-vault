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

---

# Mission: 모의투자 실시간 시세 전달 구조 (WebSocket + STOMP) 이해

## Why
모의투자 서비스를 설계·구현 중이다. 과거 틱 데이터를 DB에 이미 구축해 뒀고, 이걸 여러 사용자에게
실시간처럼 재생해 보여줘야 한다. 외부 증권사 WebSocket을 중계하는 구조가 아니라 **서버가 직접
재생하는 구조**다. 서버 1대 + Spring SimpleBroker + STOMP라는 전제에서, 연결·구독·전달·해지가
서버 안에서 실제로 어떻게 동작하는지를 먼저 정확히 이해해야 엔드포인트와 목적지 설계를 틀리지 않는다.
1차 목표는 개념 이해(말로 설명할 수 있는 수준), 2차 목표는 그 이해를 실제 프로젝트 설계 판단에 쓰는 것.

## Success looks like
- STOMP가 무엇이고 WebSocket이 정해주지 않는 무엇을 채워주는지 설명할 수 있다.
- Spring 메시징의 세 단어(`Message` = 헤더+페이로드, `MessageChannel` = JVM 안의 큐+스레드풀,
  `MessageHandler` = 채널에 등록된 콜백)를 각각 정의하고, 배관도를 그 단어들로 읽을 수 있다.
- 브로커가 오래 보관하는 것은 **구독 목록뿐이며 메시지는 저장하지 않는다**는 것과, 그 결과
  구독 전에 발행된 것은 볼 수 없다는 것(Kafka와의 차이)을 설명할 수 있다.
- 세션 쿠키 인증에서 Principal이 어디서 확정되는지, CSWSH와 세션 만료 간극이 왜 문제인지 말할 수 있다.
- STOMP 엔드포인트를 종목별로 파는 게 아니라 하나로 두고, 종목 구분은 목적지 문자열이 한다는 것을 설명할 수 있다.
- 연결이 HTTP 핸드셰이크 + STOMP CONNECT 두 단계이고, 인증을 어디서 확정해야 하는지 말할 수 있다.
- SUBSCRIBE 프레임 한 장이 브로커 메모리의 구독 레지스트리에 (목적지, 세션ID, 구독ID) 한 줄을
  만든다는 것, 그래서 개인화가 **발행 시점이 아니라 구독 시점**에 일어난다는 것을 설명할 수 있다.
- "사용자마다 다른 정보"를 세 층위(공용 값 / 구독 조합 차이 / 진짜 개인 값)로 분리하고, 각각을
  `/topic` vs `/user/queue` 중 어디에 둘지 판단 기준을 댈 수 있다.
- 틱 1건이 N개 세션으로 복제되는 경로(brokerChannel → 레지스트리 매칭 → clientOutboundChannel)를
  컴포넌트 이름과 함께 그릴 수 있다.
- UNSUBSCRIBE는 한 줄, 연결 종료는 그 세션의 모든 줄을 지운다는 것과, 하트비트가 죽은 구독 청소를
  위한 장치라는 것을 설명할 수 있다.
- 구독 직후 스냅샷 공백, 틱 폭주, 느린 클라이언트, 서버 2대 확장 시 SimpleBroker의 한계를
  설계 판단 근거로 말할 수 있다.

## Constraints
- **재생 시계는 전 사용자 공용** — 서버가 하나의 가상 장(場)을 돌린다. (2026-09-01 확정)
- **인증은 세션(쿠키) 방식** — JWT가 아니다. 핸드셰이크 HTTP 요청에서 Principal이 확정된다. (2026-09-01 확정)
- 서버 1대, 브로커는 Spring 내장 SimpleBroker, 프로토콜은 STOMP.
- 코드 구현보다 **내부 동작 설명**이 우선. 다만 실제 프로젝트 설계 중이므로 판단 기준과 함정은 함께 다룬다.
- **2026-09-01 수정:** 처음엔 "코드로 설명하지 말 것"이었으나, 개념을 잡은 뒤 사용자가 직접 코드 레벨
  설명을 요청했다. 이제 **설정 파일·컨트롤러·타입 시그니처 수준의 코드는 허용**한다 — 개념이 실제
  코드의 어디에 대응하는지 보여주는 용도로만 쓰고, 구현 튜토리얼이 되지는 않는다.
- 설명은 정확하고 명확하게, 한국어로 제공한다.
- 구조를 다룰 때는 SVG 다이어그램을 함께 그린다.

## Out of scope
- ~~외부 브로커 릴레이는 "언제 필요해지는가" 수준까지만~~ → **2026-09-01 범위 편입.**
  사용자가 직접 "RabbitMQ를 쓰면 채널은 그대로고 브로커만 바뀌는 구조냐"고 물어 0034를 만들었다.
  다만 여전히 **비교·판단 수준**이다: 실제 RabbitMQ 구축·운영, 리더 선출 구현은 제외한다.
- SockJS 폴백, 클라이언트 라이브러리 API 상세는 지금 제외한다.
