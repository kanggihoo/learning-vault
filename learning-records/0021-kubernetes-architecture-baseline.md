# 쿠버네티스 구조 학습 기준점

새 학습 주제로 쿠버네티스가 추가됐다. 사용자의 출발점은 **Docker는 어느 정도 알지만 쿠버네티스는 처음**이며, 요청은 "자주 쓰는 용어 + 전체 구조를 HTML로 시각화해서 설명"이었다. 그래서 첫 레슨(0015)은 skill 연습보다 **지도(map) 제공**을 우선했다.

이 레슨에서 확립한 기준점:

- **두 덩어리 모델**: Control Plane(결정) / Node(실행). 모든 설명은 이 이분법 위에 올린다.
- **두 개의 규칙**: ① 모든 통신은 kube-apiserver를 거친다(etcd 쓰기 포함) ② 아무도 명령받지 않고, 각자 apiserver를 watch하다 스스로 움직인다(느슨한 결합).
- **선언형(declarative)이 관통 개념**: "명령"이 아니라 "희망 상태 선언" + reconciliation loop. 자동 복구·롤링 업데이트·스케일이 전부 여기서 파생된다.
- **Docker 대응표를 앵커로 사용**: 컨테이너→Pod, 서버→Node, compose→매니페스트, `--restart=always`→Deployment, 서비스이름→Service. 기존 지식에 붙이는 방식이 이 사용자에게 효과적이었던 전례(React Hooks 레슨)를 따랐다.
- **의도적으로 뺀 것**: Ingress, ConfigMap/Secret, Volume/PV/PVC, StatefulSet/DaemonSet, RBAC, HPA. working memory 보호를 위해 첫 레슨에서 제외했다. Namespace는 용어표에만 한 줄로 남겼다.

교정 대상으로 미리 표시해둔 오개념 5가지: "Pod=컨테이너", "K8s가 Docker를 대체", "scheduler가 실행한다", "Pod IP로 직접 통신", "ReplicaSet을 직접 만든다".

다음 레슨 후보는 ① YAML 매니페스트 직접 읽고 쓰기 ② Service·Ingress로 외부 트래픽 받기 ③ ConfigMap/Secret 설정 분리 — 사용자 선택 대기 중. 아직 사용자가 실제로 클러스터를 띄워본 적이 있는지, 학습 목적이 무엇인지(취업/실무 투입/운영 중인 서비스 이전 등)는 확인되지 않았다. 이 답에 따라 MISSION 항목을 새로 추가해야 한다.
