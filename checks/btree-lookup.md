# btree-lookup: B-tree에서 key 하나를 찾을 때 어떤 page를 어떤 순서로 읽는지 그림 없이 설명한다

Version: 1
Task: `users` 테이블에 primary key `id`가 있고 B-tree index다. `SELECT * FROM users WHERE id = 4200` 을 실행하면 DB는 디스크(또는 buffer)에서 무엇을 어떤 순서로 읽어 row를 찾는가? 네 말로 단계별로 설명해 줘. 그리고 row가 1억 개로 늘어나도 왜 몇 번만 읽으면 되는지 한 줄로.
Pass when: (1) 고정 크기 page 단위로 읽는다 (2) root page에서 시작해 각 page 안의 key 범위 경계를 보고 4200이 속한 child page 참조를 따라 내려간다 (3) leaf page에 도달해 값(또는 값에 대한 참조)을 얻는다 (4) 한 page가 수백 개 child를 가리키므로(branching factor) depth가 log로만 늘어 몇 단계면 된다 — DDIA ch04 "B-tree" (Preprocessed/chapters/04, study/ch04.md §B-tree)
Also accept: "page" 대신 "노드/블록"이라 불러도 의미가 같으면 통과. depth 숫자(3~4단계 등)는 없어도 됨.
Aids allowed: none
