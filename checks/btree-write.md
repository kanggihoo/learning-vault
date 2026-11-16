# btree-write: B-tree에서 INSERT(split)·UPDATE(덮어쓰기)·DELETE가 각각 어느 page를 바꾸는지, 왜 WAL에 먼저 쓰는지 예측한다

Version: 1 (진단용: split 부분만 확인)
Task: B-tree의 leaf page 하나가 key 4000~4999를 담당하는데 이미 꽉 차 있다. 여기에 `INSERT id = 4201`을 하면 B-tree에 어떤 일이 생길 것 같아? 배운 적 없으면 추측이어도 좋으니 예측해 줘.
Pass when: (1) 그 leaf page를 둘로(대략 반씩) 나눈다 (2) 부모 page에 새 경계 key와 새 page 참조를 추가해 범위 구분을 갱신한다 (3) 부모도 꽉 차 있으면 부모도 나뉘고 위로 전파될 수 있다(root가 나뉘면 새 root) — (3)은 없어도 (1)(2)면 split 부분 통과 — DDIA ch04 「B-tree」 그림 4-6
Also accept: "노드 분할", "page를 쪼갠다" 등 같은 의미.
Aids allowed: none
