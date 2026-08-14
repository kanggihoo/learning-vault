# Learning Index

This index points to saved learning material in this Learning Vault.

## Git

### Collaboration: Rebase, Push, Pull, PR Flow

**Lessons**

- [0001 - 협업 Git에서 rebase를 써도 되는 순간](./lessons/0001-when-to-rebase-in-team-git.html)
- [0002 - rebase와 push가 실제로 바꾸는 것](./lessons/0002-rebase-push-remote-visual.html)
- [0003 - PR Rebase and merge가 괜찮은 경우와 꼬이는 경우](./lessons/0003-pr-rebase-merge-vs-rebased-shared-branch.html)

**References**

- [0001 - Git rebase 협업 치트시트](./reference/0001-git-rebase-collaboration-cheatsheet.html)

**Learning Records**

- [0001 - Git 협업 rebase 기준 학습 시작](./learning-records/0001-git-collaboration-baseline.md)
- [0002 - Git rebase 협업 멘탈 모델](./learning-records/0002-git-rebase-collaboration-mental-model.md)

## Auth

### OAuth2 Login Flow

**Lessons**

- [0004 - OAuth2 로그인 흐름: 세션 방식과 무상태 방식](./lessons/0004-oauth2-login-flow-stateless-vs-session.html)
- [0005 - OAuth2 state 쿠키와 프론트 복귀 흐름](./lessons/0005-oauth2-cookie-state-and-frontend-return.html)
- [0006 - React에서 OAuth2 로그인 후 인증 상태 복원하기](./lessons/0006-react-auth-bootstrap-after-oauth2.html)
- [0007 - OAuth2 fragment, implicit flow, PKCE 이해하기](./lessons/0007-oauth2-fragment-implicit-flow-pkce.html)

**References**

- [0002 - OAuth2 로그인 흐름 치트시트](./reference/0002-oauth2-login-flow-cheatsheet.html)
- [0003 - React 인증 상태 복원 치트시트](./reference/0003-react-auth-bootstrap-cheatsheet.html)

**Topic Summaries**

- [0001 - OAuth2 로그인 흐름 최종 정리와 학습 패턴](./summaries/0001-oauth2-final-summary-and-learning-patterns.md)

**Learning Records**

- [0003 - OAuth2 로그인 흐름 멘탈 모델 보정](./learning-records/0003-oauth2-login-flow-mental-model.md)
- [0004 - OAuth2 state와 ID Token 검증 기준](./learning-records/0004-oauth2-state-and-id-token-validation.md)
- [0005 - OAuth2 쿠키 state와 프론트 복귀 흐름](./learning-records/0005-oauth2-cookie-state-and-frontend-return.md)
- [0006 - React 인증 상태 복원과 HttpOnly RT](./learning-records/0006-react-auth-bootstrap-with-http-only-refresh-token.md)
- [0007 - OAuth2 fragment와 implicit flow 구분](./learning-records/0007-oauth2-fragment-implicit-flow-pkce.md)
- [0008 - OAuth2 최종 정리본 저장 위치 보정](./learning-records/0008-oauth2-final-summary-placement-corrected.md)

## Frontend

### React Hooks

**Lessons**

- [0011 - React Hooks: 언제 어떤 Hook을 쓰는가](./lessons/0011-react-hooks-when-to-use.html)
- [0012 - React Hooks 실제 코드 상황별 예제](./lessons/0012-react-hooks-code-situations.html)

**References**

- [0006 - React Hooks 선택 치트시트](./reference/0006-react-hooks-selection-cheatsheet.html)

**Learning Records**

- [0017 - React Hooks 선택 기준 질문 시작](./learning-records/0017-react-hooks-selection-baseline.md)
- [0018 - useCallback 참조 안정성 멘탈 모델](./learning-records/0018-usecallback-referential-stability-mental-model.md)

## Web Security

### CSRF Token

**Lessons**

- [0010 - CSRF 토큰이 막는 문제와 실제 사용 흐름](./lessons/0010-csrf-token-attack-and-defense.html)

**References**

- [0005 - CSRF 토큰 치트시트](./reference/0005-csrf-token-cheatsheet.html)

**Topic Summaries**

- [0003 - CSRF 토큰 최종 정리](./summaries/0003-csrf-token-final-summary.md)

**Learning Records**

- [0015 - CSRF 토큰 질문 기준점](./learning-records/0015-csrf-token-question-baseline.md)
- [0016 - CSRF와 CORS/Origin 검증 멘탈 모델](./learning-records/0016-csrf-cors-origin-mental-model.md)

### HTTPS, TLS, SSL Certificates, Let's Encrypt

**Lessons**

- [0008 - HTTP가 HTTPS가 될 때 TLS와 인증서가 하는 일](./lessons/0008-http-https-tls-ssl-certificate.html)
- [0009 - 브라우저에서 HTTPS 요청이 서버까지 가는 계층 흐름](./lessons/0009-browser-https-layer-flow.html)

**References**

- [0004 - HTTPS/TLS/SSL 인증서 치트시트](./reference/0004-https-tls-ssl-certificate-cheatsheet.html)

**Topic Summaries**

- [0002 - SSL/TLS와 HTTPS 최종 정리](./summaries/0002-ssl-tls-https-final-summary.md)

**Learning Records**

- [0009 - HTTPS, TLS, 인증서 질문 기준점](./learning-records/0009-https-tls-certificate-question-baseline.md)
- [0010 - HTTPS 계층과 key exchange 멘탈 모델 보정](./learning-records/0010-https-layer-and-key-exchange-mental-model.md)
- [0011 - OSI 모델에서 TLS 위치 혼동 보정](./learning-records/0011-osi-and-tls-layer-placement.md)
- [0012 - TLS session key와 로그인 session 구분](./learning-records/0012-tls-session-key-vs-login-session.md)
- [0013 - 인증서 형태와 TLS session key 물리적 모양 구분](./learning-records/0013-certificate-shape-and-session-key-bytes.md)
- [0014 - SSL/TLS 최종 멘탈 모델 확립](./learning-records/0014-ssl-tls-final-mental-model.md)

## Distributed Backend Architecture

### Transactional Outbox

**Lessons**

- [0013 - Dual-write 문제와 Transactional Outbox](./lessons/0013-transactional-outbox-dual-write.html)
- [0014 - Redis Streams Consumer Group: 작업 분배와 회수](./lessons/0014-redis-streams-consumer-group.html)

**References**

- [0007 - Transactional Outbox 치트시트](./reference/0007-transactional-outbox-cheatsheet.html)
- [0008 - Redis Streams Consumer Group 치트시트](./reference/0008-redis-streams-consumer-group-cheatsheet.html)
- [0010 - Redis Streams 내부 구조 시각화](./reference/0010-redis-streams-internals-visual.html)

**Learning Records**

- [0019 - Transactional Outbox 학습 기준점](./learning-records/0019-transactional-outbox-baseline.md)
- [0020 - Redis Streams Consumer Group 학습 기준점](./learning-records/0020-redis-streams-consumer-group-baseline.md)

## Kubernetes

### Cluster Architecture

**Lessons**

- [0015 - 쿠버네티스 전체 구조: Docker에서 K8s로](./lessons/0015-kubernetes-architecture-overview.html)

**References**

- [0009 - 쿠버네티스 구조·용어 치트시트](./reference/0009-kubernetes-architecture-cheatsheet.html)

**Learning Records**

- [0021 - 쿠버네티스 구조 학습 기준점](./learning-records/0021-kubernetes-architecture-baseline.md)
## Kafka

### Core Concepts, Use Cases, KRaft vs ZooKeeper

**Lessons**

- [0016 - Kafka란 무엇인가: Event Streaming과 핵심 개념](./lessons/0016-kafka-core-concepts-event-streaming.html)
- [0017 - Kafka를 실제로 어디에 쓰는가: 대표 사용 사례 7가지](./lessons/0017-kafka-use-cases.html)
- [0018 - 카프카 클러스터의 두뇌: ZooKeeper에서 KRaft로](./lessons/0018-kraft-vs-zookeeper.html)
- [0019 - Kafka Design 딥다이브: 저장, 효율, Producer/Consumer, 복제](./lessons/0019-kafka-design-deep-dive.html)

**References**

- [0009 - Kafka 핵심 개념 & KRaft vs ZooKeeper 치트시트](./reference/0009-kafka-core-concepts-cheatsheet.html)

**Learning Records**

- [0021 - Kafka 학습 시작 - 실무 도입 목표 기준점](./learning-records/0021-kafka-learning-baseline.md)

### Operations: 운영, 지리 복제, 모니터링, KRaft 실전, Tiered Storage

**Lessons**

- [0020 - Kafka 운영 기초: 클러스터를 실제로 돌보는 법](./lessons/0020-kafka-operations-basics.html)
- [0021 - 여러 클러스터, 여러 팀: Geo-Replication과 Multi-Tenancy](./lessons/0021-kafka-geo-replication-and-multi-tenancy.html)
- [0022 - KRaft 클러스터 운영: Controller를 늘리고 줄이고 진단하기](./lessons/0022-kraft-cluster-operations.html)
- [0023 - Kafka 모니터링: 뭘 보고 뭘 걱정해야 하나](./lessons/0023-kafka-monitoring-essentials.html)
- [0024 - Tiered Storage: 로컬 디스크와 무한한 창고를 나눠 쓰기](./lessons/0024-kafka-tiered-storage.html)
- [0025 - 다음 단계 미리 보기: Rebalance, Transaction, ELR 프로토콜 3종](./lessons/0025-kafka-advanced-protocols-overview.html)

**References**

- [0011 - Kafka 모니터링 핵심 지표 치트시트](./reference/0011-kafka-monitoring-cheatsheet.html)

**Learning Records**

- [0022 - Kafka 운영 학습 범위 확정](./learning-records/0022-kafka-operations-scope-baseline.md)
