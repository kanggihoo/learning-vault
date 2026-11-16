# btree-lookup — 시간복잡도 결론은 알지만 page를 내려가는 메커니즘은 없음

Concept: btree-lookup, unassessed → needs-repair
Date: 2026-11-16

학습자는 "트리 기반이라 full scan O(n) 대신 O(log n)으로 찾는다"고 답했다. 결론은 맞다. 다만 무엇을 읽는지(고정 크기 page), 어떤 순서로 읽는지(root에서 key 범위 경계를 보고 child 참조를 따라 leaf까지), 왜 1억 row에도 3~4번이면 끝나는지(branching factor 수백이라 log의 밑이 2가 아니라 수백)가 빠졌다. 학습자가 원하는 "직관적 그림"이 정확히 이 빈칸이다.

**교정할 오해 후보:** O(log n)을 이진 트리의 log₂로 떠올리면 1억 row에 27단계다. 실제 B-tree는 page 하나가 수백 개 child를 가리켜 3~4단계다. 디스크 읽기 횟수 = depth라는 연결이 핵심.

Evidence: checks/btree-lookup.md v1; 답 요지 "트리 기반 인덱스라 where 4200 찾기가 full scan보다 빠르게 log 시간복잡도, O(n)→O(log n)"; aids: none; judged: gap, because Pass when (4)의 방향만 맞고 (1) page 단위 (2) root→경계→child 하강 (3) leaf 도달이 없음.

**Implications**
- 레슨 0056은 page 단위 하강을 단계별 인터랙티브로 보여 주고, log₂ vs log₅₀₀ 비교로 "몇 번 읽기"를 숫자로 잡는다.
- 재확인은 바뀐 과제로(예: 다른 key, secondary index 경유 또는 depth 계산).
