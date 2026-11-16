# btree-lookup: key 하나를 찾을 때 root→leaf로 어떤 page를 어떤 순서로 읽는지, 왜 몇 번이면 끝나는지 설명한다

Version: 2
Task: `orders` 테이블의 PK B-tree는 branching factor가 약 400이고 3층이다. `SELECT * FROM orders WHERE id = 917` 을 실행할 때 DB가 읽는 page를 순서대로 말하고, 각 page에서 "무엇을 보고 다음을 고르는지" 한 줄씩 설명해 줘. 마지막으로, 주문이 400배로 늘면 이 조회에서 읽는 page 수는 어떻게 변하는지와 그 이유를 말해 줘.
Pass when: (1) root page부터 읽는다 (2) root와 중간 page에서 경계 key와 917을 비교해 child 참조 하나만 따라간다(다른 child는 안 읽음) (3) 3번째에 leaf page에 도달해 917의 값(또는 값의 위치)을 얻는다, 총 3 page (4) 400배 늘면 깊이가 한 층 늘어 4 page쯤이 된다. 이유는 page 하나가 ~400갈래라 400배마다 한 층(log₄₀₀) — DDIA ch04 「B 树」
Also accept: "약 1번 더", "4번" 등 의미가 같은 표현. 위쪽 page가 buffer에 있어 실제 디스크 읽기가 적을 수 있다는 언급은 가점이지 필수 아님.
Aids allowed: none
