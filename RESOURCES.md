# Learning Vault Resources

## Git Knowledge

- [Pro Git: Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
  Git 공식 책의 rebase 장. Use for: rebase가 커밋을 재적용하는 방식, 공개된 커밋을 rebase하면 안 되는 이유.
- [git-rebase manual](https://git-scm.com/docs/git-rebase)
  Git 공식 rebase 명령어 문서. Use for: `--onto`, `--interactive`, `--rebase-merges`, conflict 처리 옵션 확인.
- [git-push manual](https://git-scm.com/docs/git-push)
  Git 공식 push 명령어 문서. Use for: `--force-with-lease`, upstream 설정, 안전한 강제 push 의미 확인.
- [git-pull manual](https://git-scm.com/docs/git-pull)
  Git 공식 pull 명령어 문서. Use for: `pull --rebase`, fetch 후 통합 방식 선택 확인.

## Auth Knowledge

- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
  OAuth2 표준 문서. Use for: 역할, authorization code grant, `state`, token endpoint 흐름 확인.
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
  OAuth2 최신 보안 권고. Use for: implicit flow 회피, PKCE, `state`/CSRF 방어 기준 확인.
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636.html)
  PKCE 표준 문서. Use for: authorization code 탈취 방어, `code_verifier`, `code_challenge` 흐름 확인.
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
  OAuth2 위에서 로그인 인증을 다루는 OIDC 핵심 명세. Use for: ID Token, `sub`, `nonce`, 토큰 검증 기준 확인.
- [Google: Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
  Google OAuth2 웹 서버 구현 문서. Use for: 구글 authorization URL, callback, code 교환, `state` 처리 확인.
- [Google: Verify the Google ID token on your server side](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
  Google ID Token 서버 검증 문서. Use for: Google 공개키/JWKS, `aud`, `iss`, `exp`, `sub` 검증 기준 확인.
- [React: useEffect](https://react.dev/reference/react/useEffect)
  React 공식 Hook 문서. Use for: 앱 시작 시 외부 시스템인 인증 API와 동기화하는 패턴 확인.
- [React: createContext](https://react.dev/reference/react/createContext)
  React 공식 Context 생성 문서. Use for: 인증 상태를 앱 전체에 전달하는 Provider 구조 확인.
- [React: useContext](https://react.dev/reference/react/useContext)
  React 공식 Context 소비 문서. Use for: Header, route guard 등에서 인증 상태를 읽는 방식 확인.
- [MDN: Request credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
  Fetch credentials 옵션 문서. Use for: cross-origin 요청에서 쿠키를 포함하는 `credentials: "include"` 의미 확인.
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
  HTTP 쿠키 설정 헤더 문서. Use for: `HttpOnly`, `Secure`, `SameSite`, `Max-Age`, `Path` 동작 확인.

## React Hooks Knowledge

- [React: useEffect](https://react.dev/reference/react/useEffect)
  React 공식 Hook 문서. Use for: 외부 시스템과 동기화하는 Effect의 목적, dependency, cleanup 기준 확인.
- [React: useRef](https://react.dev/reference/react/useRef)
  React 공식 Hook 문서. Use for: 렌더링에 필요 없는 값 보관, DOM ref, `current` 변경이 re-render를 만들지 않는다는 기준 확인.
- [React: useMemo](https://react.dev/reference/react/useMemo)
  React 공식 Hook 문서. Use for: 계산 결과 캐시, dependency 기준 재계산, 성능 최적화로만 의존해야 한다는 기준 확인.
- [React: useCallback](https://react.dev/reference/react/useCallback)
  React 공식 Hook 문서. Use for: 함수 참조 캐시, `memo`된 자식 컴포넌트 최적화, `useMemo`와의 차이 확인.
- [React: useReducer](https://react.dev/reference/react/useReducer)
  React 공식 Hook 문서. Use for: reducer/action 기반 상태 변경, dispatch, reducer 순수성 기준 확인.

## Web Security Knowledge

- [OWASP: Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
  CSRF 방어 공식 치트시트. Use for: synchronizer token pattern, double-submit cookie, custom header, SameSite, Origin/Referer 검증 기준 확인.
- [MDN: Cross-site request forgery](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)
  브라우저 관점의 CSRF 개념 문서. Use for: 쿠키 자동 첨부, state-changing request, form 기반 공격 예시, SameSite의 한계 확인.
- [Spring Security: Cross Site Request Forgery](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
  Spring Security CSRF 공식 문서. Use for: 기본 CSRF 보호, `CookieCsrfTokenRepository`, `XSRF-TOKEN`, `X-XSRF-TOKEN`, SPA 연동 기준 확인.
- [RFC 5280: Internet X.509 Public Key Infrastructure Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280.html)
  X.509 인증서 표준 문서. Use for: 인증서 필드, Subject, Issuer, Validity, Subject Public Key Info, Extensions, 인증 경로 검증 확인.
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
  HTTP 의미론 표준 문서. Use for: HTTP가 application-level protocol이고 `http`/`https` URI scheme이 어떻게 구분되는지 확인.
- [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)
  HTTP/2 표준 문서. Use for: 하나의 연결 위에서 여러 HTTP stream을 multiplex하는 구조 확인.
- [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
  TLS 1.3 표준 문서. Use for: TLS가 제공하는 보안 채널, handshake, key exchange, application data 보호 기준 확인.
- [MDN: HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
  HTTPS 개념 문서. Use for: HTTPS가 HTTP를 TLS로 암호화한 버전이라는 기본 정의 확인.
- [MDN: Transport Layer Security](https://developer.mozilla.org/en-US/docs/Glossary/TLS)
  TLS 개념 문서. Use for: TLS가 SSL을 대체한 프로토콜이며 웹 통신 보안에 쓰인다는 용어 정리 확인.
- [MDN: Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
  HSTS 헤더 문서. Use for: 브라우저가 이후 요청을 HTTPS로 강제하게 만드는 방식 확인.
- [Let's Encrypt: How It Works](https://letsencrypt.org/how-it-works/)
  공개 CA인 Let's Encrypt의 인증서 발급 흐름 설명. Use for: 도메인 검증, 인증서 발급, 자동 갱신의 큰 흐름 확인.

## Distributed Backend Architecture Knowledge

- [microservices.io: Pattern — Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)
  Chris Richardson의 마이크로서비스 패턴 카탈로그. Use for: dual-write 문제, outbox 테이블, Message Relay, Polling Publisher vs Transaction Log Tailing(CDC) 구분.
- [Confluent: Understanding the Dual-Write Problem and Its Solutions](https://www.confluent.io/blog/dual-write-problem/)
  Dual-write 문제의 정설. Use for: 두 독립 시스템을 원자적으로 갱신할 수 없는 이유, 부분 실패 시나리오, 2PC를 피하는 이유.
- [Redis: Introduction to Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/)
  Redis Streams 공식 소개. Use for: XADD, Consumer Group 전체 개념, Pending Entries List 기본.
- [Redis: XREADGROUP command](https://redis.io/docs/latest/commands/xreadgroup/)
  XREADGROUP 공식 문서. Use for: `>`(새 메시지) vs `0`(내 pending) 구분, PEL 생성, Worker crash 복구 루프 의사코드.
- [Redis: XACK command](https://redis.io/docs/latest/commands/xack/)
  XACK 공식 문서. Use for: PEL에서 메시지 제거 = "처리 완료 확정"의 의미, ack 안 하면 영원히 pending에 남는 점.
- [Redis: XPENDING command](https://redis.io/docs/latest/commands/xpending/)
  XPENDING 공식 문서. Use for: PEL 조회(요약/상세 형태), consumer별 pending, delivery count, idle 필터.
- [Redis: XAUTOCLAIM command](https://redis.io/docs/latest/commands/xautoclaim/)
  XAUTOCLAIM 공식 문서. Use for: 죽은 Consumer의 Pending 메시지 회수, min-idle-time 임계값, delivery count 증가, cursor 반환.
- [microservices.io: Pattern — Polling Publisher](https://microservices.io/patterns/data/polling-publisher.html)
  Polling Publisher 패턴. Use for: outbox를 polling으로 relay하는 방식과 그 한계.
- [microservices.io: Pattern — Transaction Log Tailing](https://microservices.io/patterns/data/transaction-log-tailing.html)
  Transaction Log Tailing(CDC) 패턴. Use for: DB 트랜잭션 로그를 읽어 relay하는 방식(Debezium).


## Kubernetes Knowledge

- [Kubernetes: Cluster Architecture](https://kubernetes.io/docs/concepts/architecture/)
  쿠버네티스 공식 아키텍처 문서. Use for: Control Plane(kube-apiserver, etcd, kube-scheduler, kube-controller-manager, cloud-controller-manager)과 Node(kubelet, kube-proxy, 컨테이너 런타임) 컴포넌트의 공식 정의 확인.
- [Kubernetes: Overview](https://kubernetes.io/docs/concepts/overview/)
  쿠버네티스 개요. Use for: K8s가 해주는 것과 해주지 않는 것, 컨테이너 오케스트레이션의 목적 확인.
- [Kubernetes: Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
  Pod 공식 문서. Use for: 배포 가능한 최소 단위 정의, 네트워크·저장소 공유, Pod를 직접 만들지 않는 이유 확인.
- [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  Deployment 공식 문서. Use for: 선언적 업데이트, Deployment→ReplicaSet→Pod 관계, 롤링 업데이트·롤백 확인.
- [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)
  Service 공식 문서. Use for: Pod IP 변동 문제, 라벨 셀렉터, ClusterIP/NodePort/LoadBalancer/ExternalName 확인.
- [Kubernetes Basics 튜토리얼](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
  공식 인터랙티브 입문 튜토리얼. Use for: 브라우저에서 직접 클러스터를 다뤄보는 실습.
- [kubectl Quick Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
  kubectl 공식 치트시트. Use for: 명령어와 옵션을 목적별로 찾을 때.

## Kafka Knowledge

- [Apache Kafka: Introduction](https://kafka.apache.org/intro)
  Kafka 공식 입문 문서. Use for: event streaming 정의, Broker/Topic/Partition/Producer/Consumer/Replication 핵심 개념, Kafka API 5종.
- [Apache Kafka: Use Cases](https://kafka.apache.org/uses)
  Kafka 공식 사용 사례 문서. Use for: 메시징, 활동 추적, 메트릭, 로그 집계, 스트림 처리, 이벤트 소싱, 커밋 로그 등 실무 적용 예 확인.
- [Apache Kafka Documentation: KRaft](https://kafka.apache.org/documentation/#kraft)
  KRaft 공식 문서. Use for: ZooKeeper mode와의 설정/metric 차이, controller quorum, ZooKeeper to KRaft migration 절차 확인.
- [Confluent: What is Apache Kafka?](https://developer.confluent.io/what-is-apache-kafka/)
  입문자 친화적 보충 설명. Use for: event streaming 비유, 처음 배우는 사람 관점의 설명 확인.
- [LinkedIn Engineering: The Log](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying/)
  Kafka 원작자 Jay Kreps의 글. Use for: Kafka의 다양한 사용 사례가 왜 하나의 로그 추상화에서 나오는지 확인.


## WebSocket / STOMP Knowledge

- [Spring Framework: STOMP](https://docs.spring.io/spring-framework/reference/web/websocket/stomp.html)
  Spring STOMP 공식 문서 루트. Use for: `@EnableWebSocketMessageBroker`, `registerStompEndpoints`, `enableSimpleBroker`, `setApplicationDestinationPrefixes` 확인.
- [Spring Framework: Flow of Messages](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/message-flow.html)
  세 채널과 핸들러 배관의 원문. Use for: `clientInboundChannel`/`brokerChannel`/`clientOutboundChannel`, `StompSubProtocolHandler`, `SimpleBrokerMessageHandler`가 어떤 채널을 구독하는지 확인.
- [Spring Framework: User Destinations](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/user-destination.html)
  `/user` 목적지 재작성 규칙. Use for: `/user/queue/x` → `/queue/x-{sessionId}` 변환, `convertAndSendToUser`, `broadcast=false`, Principal 없는 세션의 동작 확인.
- [Spring Framework: Simple Broker](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/handle-simple-broker.html)
  SimpleBroker 공식 설명. Use for: 메모리 기반 구독 레지스트리, 단일 서버 전제, 하트비트 설정 확인.
- [Spring Framework: WebSocket STOMP Events](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/application-context-events.html)
  세션 이벤트 문서. Use for: `SessionConnectedEvent`, `SessionSubscribeEvent`, `SessionUnsubscribeEvent`, `SessionDisconnectEvent`가 발생하는 시점 확인.
- [Spring Framework: Configuration and Performance](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/configuration-performance.html)
  채널 스레드 풀과 전송 한도 설정. Use for: 느린 클라이언트 대응(send buffer/time limit), inbound/outbound 풀 크기 판단.
- [DefaultSubscriptionRegistry Javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/messaging/simp/broker/DefaultSubscriptionRegistry.html)
  구독 레지스트리 구현 문서. Use for: `AntPathMatcher` 기반 목적지 매칭, 캐시 한도 기본값(1024), selector 헤더 확인.
- [STOMP Protocol Specification 1.2](https://stomp.github.io/stomp-specification-1.2.html)
  STOMP 표준 문서. Use for: CONNECT/CONNECTED/SUBSCRIBE/UNSUBSCRIBE/SEND/MESSAGE/DISCONNECT 프레임의 필수 헤더, `heart-beat` 협상 규칙(양쪽 MAX), ack 모드 확인.

- [MDN: The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
  WebSocket 개요. Use for: HTTP 핸드셰이크로 시작해 같은 TCP 연결에서 프로토콜만 바뀐다는 것, 브라우저 API 확인.
- [RFC 6455: The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455.html)
  WebSocket 표준 문서. Use for: `Upgrade`/`Connection` 헤더, `101 Switching Protocols`, `Sec-WebSocket-Key`, Origin 검사 책임이 서버에 있다는 규정 확인.
- [OWASP: Testing for Cross Site WebSocket Hijacking](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/10-Testing_WebSockets)
  CSWSH 설명. Use for: 쿠키 인증 WebSocket에서 Origin 화이트리스트가 왜 필수인지 확인.
- [Spring Framework: WebSocket Security](https://docs.spring.io/spring-security/reference/servlet/integrations/websocket.html)
  Spring Security WebSocket 연동 문서. Use for: 핸드셰이크에서 Principal이 확정되는 경로, 메시지 단위 인가 설정 확인.

## Market Replay Backend Knowledge

### 스케줄링·시간 (레슨 0036)

- [Spring Framework Reference: Task Execution and Scheduling](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
  Spring 스케줄링 공식 레퍼런스. Use for: `fixedDelay`/`fixedRate` 정의, 스케줄러 기본 풀이 스레드 1개라는 사실,
  `TaskScheduler`/`Trigger` 추상화. **레슨 0036의 1차 출처.**
- [Java 21: ScheduledExecutorService](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ScheduledExecutorService.html)
  JDK 스케줄러 javadoc. Use for: `scheduleAtFixedRate`가 `initialDelay + k*period`로 **최초 시각에 앵커된다**는 원문,
  겹쳐 실행하지 않는다는 규정("may start late, but will not concurrently execute"). 드리프트 논거를 검증할 때 여기를 본다.
- [Spring: TaskScheduler](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/TaskScheduler.html)
  Use for: 가변 간격을 표현하는 두 시그니처 — `schedule(Runnable, Trigger)`와 `schedule(Runnable, Instant)`.
- [Spring: @Scheduled javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/annotation/Scheduled.html)
  Use for: 애노테이션 속성 전체, 가상 스레드에서 fixed-delay가 단일 스케줄러 스레드에서 도는 이유.
- [MDN: setTimeout — Timeouts in inactive tabs](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#timeouts_in_inactive_tabs)
  Use for: 백그라운드 탭 스로틀의 **정확한 조건과 수치** — Chrome의 Throttling(초당 1회)/Intensive throttling(분당 1회,
  Chrome 88+, 비가시 5분↑·무음 30초↑·체인 5단↑·WebRTC 비활성), Firefox Desktop 1초, Firefox Android 15분·탭 언로드.
  서버가 "남은 초"를 보내지 않는 이유의 근거. **WebSocket 예외는 이 문서에 없다** — 있다고 쓴 2차 자료를 믿지 말 것.
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
  Use for: 탭 재활성화 시점을 잡는 방법. `acc.md`의 부재 요약 호출 시점 판단에 쓰인다.

### 프로젝트 문서 (사내 · 1차 진실)

- `S15P21A605/docs/projects/마켓리플레이_기능명세서_v0.7_통합.md` — 게임 규칙의 정본. 미결 논점 11건 포함.
- `S15P21A605/docs/projects/market-replay-api/_common.md` — **먼저 읽는 문서.** 경로·인증·응답 봉투·금액 표현·게임 시계·phase·미래 차단·실시간 메시지.
- `market-replay-api/glossary.md` — 기획서 한국어 ↔ 코드·API 영어. 기각한 후보와 이유.
- `market-replay-api/conflicts.md` — 전제가 흔들리는 지점. 항목마다 **결정 시한**이 있다.
- `market-replay-api/spec-revisions.md` — 결정은 났는데 기획서 문장이 그대로인 것. R-1이 720초 그리드다.
- **구현이 시작되면 코드가 진실이다** — 엔드포인트 스키마는 Swagger(`springdoc-openapi`)로 옮겨간다.

## Wisdom (Communities)

- [Stack Overflow: git tag](https://stackoverflow.com/questions/tagged/git)
  실무에서 자주 터지는 Git 상황별 질문이 많다. Use for: 에러 메시지와 복구 절차를 실제 사례로 확인.
- [GitHub Community: GitHub and Git](https://github.com/orgs/community/discussions/categories/github-and-git)
  GitHub 기반 협업 흐름 질문이 많다. Use for: PR, protected branch, fork workflow 관련 실무 감각 확인.

- [r/kubernetes](https://www.reddit.com/r/kubernetes/)
  쿠버네티스 실무자 커뮤니티. Use for: 실제 운영 사례, 입문자 질문, 도구 선택 감각 확인.
- [Kubernetes 공식 Slack](https://slack.k8s.io/)
  쿠버네티스 공식 Slack 워크스페이스. Use for: `#kubernetes-novice` 입문자 채널에서 직접 질문.
- [Stack Overflow: kubernetes](https://stackoverflow.com/questions/tagged/kubernetes)
  쿠버네티스 질문 태그. Use for: 에러 메시지 기반 검색과 해결 사례 확인.

- [r/apachekafka](https://www.reddit.com/r/apachekafka/)
  Kafka 실무 도입·운영·트러블슈팅 사례가 많다. Use for: 실제 도입 전 흔한 함정, KRaft 마이그레이션 경험담 확인.
- [Stack Overflow: apache-kafka tag](https://stackoverflow.com/questions/tagged/apache-kafka)
  Kafka 관련 에러/설정 질문이 많다. Use for: 구체적 에러 메시지 기반 검색.

- [Stack Overflow: spring-websocket tag](https://stackoverflow.com/questions/tagged/spring-websocket)
  Spring WebSocket/STOMP 질문 태그. Use for: "구독은 되는데 메시지가 안 온다" 류의 실제 사례와 설정 함정 확인.
- [Stack Overflow: stomp tag](https://stackoverflow.com/questions/tagged/stomp)
  STOMP 프로토콜 전반 질문 태그. Use for: 프레임/하트비트/ack 관련 클라이언트-서버 불일치 사례 확인.

- [Stack Overflow: spring-scheduled tag](https://stackoverflow.com/questions/tagged/spring-scheduled)
  `@Scheduled` 관련 질문 태그. Use for: 스레드 풀 고갈, 겹침 실행, cron vs fixedRate 선택 사례 확인.
- [Spring Community Forum (spring.io)](https://spring.io/community)
  Spring 공식 커뮤니티 채널 목록. Use for: 스케줄링·WebSocket 설계 질문을 올릴 곳 찾기.

## Software Architecture Knowledge

- [Cervantes & Kazman, *Designing Software Architectures* — §2.4 Architectural Drivers](https://www.informit.com/articles/article.aspx?p=2738304&seqNum=4)
  ADD 계열의 표준 교재 발췌(무료). Use for: architecture driver 5종의 정의, 품질 속성 시나리오 6부와 <C> 버튼 표준 예시.
- [Cervantes & Kazman, 3장 — Design Concepts (전술 카탈로그)](https://www.informit.com/articles/article.aspx?p=3197432)
  같은 책 3장 발췌. Use for: 가용성·성능·보안·변경용이성·통합용이성의 전술 범주와 개별 전술 이름 확인.
  (성능 seqNum=3, 가용성 4, 변경용이성 5, 보안 6, 통합용이성 7)
- [SEI — Attribute-Driven Design Method Collection](https://www.sei.cmu.edu/library/attribute-driven-design-method-collection/)
  ADD 원출처(CMU SEI). Use for: ADD 입력(기능 요구·품질 속성 시나리오·제약)과 재귀 분해 절차 확인.
- [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html)
  품질 속성 국제 표준(유료). Use for: 정식 명칭·범위 인용이 필요할 때.
- [arc42 — ISO/IEC 25010 quality model](https://quality.arc42.org/standards/iso-25010)
  25010:2023의 9개 특성과 하위 특성을 무료로 정리. Use for: 품질 속성 어휘 확인, 2011→2023 변경(Usability→Interaction Capability, Portability→Flexibility).
- [Azure Architecture Center — Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
  기술 중립 패턴 카탈로그 40여 개, 각각 문제·고려사항·WAF 필러 표기. Use for: Cache-Aside, Circuit Breaker, CQRS, Saga, Bulkhead 등의 정의와 **패턴 조합·안티패턴** 확인.
- [Azure Architecture Center — Architecture Styles](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/)
  N-tier, Web-Queue-Worker, Microservices, Event-driven, Big data, Big compute. Use for: 스타일 = 제약이라는 정의, 스타일별 의존성 관리 방식과 적합 도메인 표.
- [microservices.io — A pattern language for microservices](https://microservices.io/patterns/)
  Chris Richardson. Use for: Saga(코레오그래피 vs 오케스트레이션), API Gateway/BFF, Database per Service, Transactional Outbox의 정본 설명.
- [c4model.com](https://c4model.com/)
  Simon Brown의 C4 모델. Use for: Context/Container/Component/Code 4레벨과 보조 다이어그램(Dynamic, Deployment).
- [adr.github.io](https://adr.github.io/) · [Nygard, Documenting Architecture Decisions (2011)](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
  ADR 표준 템플릿과 원문. Use for: Title/Status/Context/Decision/Consequences 5필드와 supersede 관행.

## Gaps

- ~~ATAM의 무료 1차 출처를 못 찾았다~~ → **2026-09-05 해결.** Clements/Kazman/Klein의 InformIT 발췌로 대체
  (위 "평가·강제·기록" 항목). ATAM 9단계 전체 절차는 여전히 유료지만, 실무에 필요한 **4산출물 정의**는 확보했다.
- AWS Builders' Library "Timeouts, retries, and backoff with jitter"는 builder.aws.com으로 301 이동했고
  본문 fetch가 안 된다. 같은 내용은 위 AWS 블로그 글로 대체했다.
- 아키텍처 학습용 커뮤니티(Wisdom)를 아직 정하지 않았다. 사용자에게 의향을 확인할 것.

### Reliability / tactics 보강 (0038에서 검증)

- [Google SRE Book — Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
  재시도 증폭의 정본 설명. Use for: "3계층 × 4회 = 64회" 계산, 서버 전역 재시도 예산(분당 60회), 랜덤 지수 백오프 권고.
- [Google SRE Book — Availability Table (Appendix A)](https://sre.google/sre-book/availability-table/)
  가용성 %를 연/분기/월/주/일 장애 시간으로 환산한 표. Use for: 목표 가용성이 전술 선택을 강제하는 논증(99.99% = 연 52.6분).
- [AWS Architecture Blog — Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
  Marc Brooker. Use for: full/equal/decorrelated jitter 비교와 시뮬레이션 결과(full jitter가 클라이언트 작업량 절반 이하).

### 스타일 선택 판단 (0039에서 검증)

- [Martin Fowler — MicroservicePremium](https://martinfowler.com/bliki/MicroservicePremium.html)
  Use for: "모놀리스로 관리하기에 너무 복잡한 시스템이 아니라면 고려조차 하지 마라", "대부분의 시스템은 하나의 모놀리식 앱으로" 인용.
- [Martin Fowler — MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html)
  Use for: 성공 사례는 거의 전부 모놀리스에서 쪼개져 나왔다는 관찰, "좋고 안정적인 서비스 경계를 찾았을 때만 잘 작동한다".
- [Martin Fowler — MicroservicePrerequisites](https://martinfowler.com/bliki/MicroservicePrerequisites.html)
  Use for: 전제 조건 3종(수 시간 내 서버 프로비저닝 · 기본 모니터링 · 수 시간 내 배포 파이프라인)과 DevOps 문화 요구.

### 패턴 조합·Saga (0040에서 검증)

- [Azure — Saga 패턴](https://learn.microsoft.com/en-us/azure/architecture/patterns/saga)
  Use for: **보상 가능(compensable) / 피벗(pivot) / 재시도 가능(retryable)** 3분류, 데이터 이상 3종(lost update·dirty read·fuzzy read), 대응책(시맨틱 락·교환 가능 갱신·비관적 뷰·값 재확인·버전 파일), 코레오그래피 vs 오케스트레이션 장단점 표.
- [Martin Fowler — CircuitBreaker](https://martinfowler.com/bliki/CircuitBreaker.html)
  Use for: Closed/Open/Half-Open 세 상태와 전이, "차단 중엔 작업을 큐에 넣거나 캐시된 데이터를 보여주라", 상태 전이 로깅이 조기 경보라는 지적.
- [Chris Richardson — Pattern: Saga](https://microservices.io/patterns/data/saga.html)
  Use for: "자동 롤백 없음 — 개발자가 보상 트랜잭션을 설계해야 한다", "격리성(ACID의 I) 없음"과 countermeasure 개념.

### 경계·조직 (0041에서 검증)

- [Martin Fowler — BoundedContext](https://martinfowler.com/bliki/BoundedContext.html)
  Use for: "언어가 달라지면 다른 모델이 필요하다", 전력회사 "계량기"의 다의성 사례, Customer/Product 다의어 경고.
- [Martin Fowler — ConwaysLaw](https://martinfowler.com/bliki/ConwaysLaw.html)
  Use for: Conway 원문 인용, "맞서 싸우려 들면 반드시 패배한다", 6팀→6서브시스템 일화, 역콘웨이 전략 3분류.
- [Martin Fowler — StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html)
  Use for: 이음매(seam) 찾기가 진짜 작업이라는 지적("그런 시스템은 유니콘이다"), 전환 아키텍처 비용 정당화, 조직 문화가 안 바뀌면 새 시스템도 같은 엉망이 된다는 경고.

### 멱등성 (0042에서 검증)

- [Azure — Idempotent Consumer](https://learn.microsoft.com/en-us/azure/architecture/patterns/idempotent-consumer)
  Use for: exactly-once 불가와 effectively-once, 중복 발생 3경로, 키 선택 규칙(correlationId 금지, 다중 구독자 복합키), **inbox 패턴**, 유니크 제약으로 경쟁 해소, 외부 호출 2단계 기록, 키 보관 기간 산정.
- [Stripe — Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
  Use for: 실제 API의 멱등 키 규칙 — V4 UUID 권장, 255자, 24시간 보관, 결과(상태코드+본문) 재현, 파라미터 불일치 시 에러, GET/DELETE엔 불필요.
- [Azure — Compensating Transaction](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction)
  Use for: 보상은 원상복구가 아니라는 것, 역순일 필요 없음, 보상 실패 시 멱등 재시도·DLQ·사람 개입, "전진 우선(재시도→대체경로→보상)", 되돌릴 수 없는 지점 명시.

### 숫자·과부하 (0043에서 검증)

- [Google SRE Book — Handling Overload](https://sre.google/sre-book/handling-overload/)
  Use for: 중요도 4등급(CRITICAL_PLUS~SHEDDABLE)과 **RPC 자동 전파**, 클라이언트 적응형 스로틀링(requests > K×accepts, K=2), 재시도 예산(요청당 3회·클라이언트 10%), "바로 위 계층에서만 재시도", 로컬 신호 기반 부하 차단, 전역 vs 국소 과부하 구분.
- [W3C — Trace Context](https://www.w3.org/TR/trace-context/)
  Use for: `traceparent` 형식(version 1B · trace-id 16B · parent-id 8B · flags 1B), `tracestate` 최대 32항목.

### 평가·강제·기록 (0044에서 검증)

- [Clements, Kazman & Klein — Evaluating Software Architectures (평가 산출물)](https://www.informit.com/articles/article.aspx?p=24371&seqNum=8)
  Use for: 위험·비위험·민감점·절충점의 정본 정의와 VPN 암호화 비트 수 예시. **§8의 ATAM 갭이 이걸로 메워졌다.**
- [Thoughtworks Radar — Architectural fitness function](https://www.thoughtworks.com/en-us/radar/techniques/architectural-fitness-function)
  Use for: 적합성 함수 정의("객관적 무결성 평가"). 주의: 2018년 항목이라 현재판엔 없다. 정본은 *Building Evolutionary Architectures*(Ford·Parsons·Kua).
