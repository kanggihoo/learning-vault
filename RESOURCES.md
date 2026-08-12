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

