# OSC 7501 Progress

이 파일은 미션 "OSC 7501 (Program Status Protocol)"의 진행만 추적한다. 이전 미션들은 `teach`로 만들어져 아직 이 형식으로 옮기지 않았다.

| id | target | prereqs | state | evidence | last checked | next check |
|---|---|---|---|---|---|---|
| osc-basics | OSC 시퀀스 한 줄에서 번호·본문·종결자를 짚고, 터미널이 모르는 번호를 만나면 어떻게 되는지 말한다 | | needs-repair | LR-0038 | 2026-11-12 | 다음 세션 |
| why-7501 | OSC 9;4·알림·OSC 133·window title로는 안 되고 7501이 되는 이유를 상황 하나로 설명한다 | osc-basics | unassessed | | | |
| report-syntax | 7501 시퀀스를 pair로 분해하고, 일부 pair만 skip되는 경우와 보고 전체가 폐기되는 경우를 가른다 | osc-basics | claimed | LR-0037 | 2026-11-12 | |
| states-model | 상황이 주어지면 알맞은 state(와 blocked면 kind)를 고른다 | report-syntax | unassessed | | | |
| record-replace | 보고 순서가 주어지면 각 시점의 record 내용을 예측한다(통째 교체, id, clear) | states-model | unassessed | | | |
| lifetime | 프로세스 종료·다음 shell prompt 뒤에 어떤 record가 남는지 예측한다 | record-replace | unassessed | | | |
| ecosystem-map | emit하는 쪽과 consume하는 쪽을 구분해 도구별 사례를 원문 근거와 함께 댄다 | why-7501 | unassessed | | | |
| emit-live | herdr에서 printf로 7501을 보내기 전에 반응을 예측하고 결과와 대조한다 | states-model, lifetime | unassessed | | | |


# DB Index (DDIA ch04 OLTP) Progress

미션 "DB 색인이 CRUD에서 어떻게 움직이는지 그림으로 이해하기"의 진행. 2026-11-16 시작.

| id | target | prereqs | state | evidence | last checked | next check |
|---|---|---|---|---|---|---|
| btree-lookup | SELECT 하나가 root→leaf로 어떤 page를 어떤 순서로 읽는지, 왜 3~4번이면 끝나는지 설명한다 | | needs-repair | LR-0040 | 2026-11-16 | 다음 세션 |
| btree-write | 빈 B-tree에 key를 하나씩 넣으며 page가 꽉 차면 split되어 위로 자라는 과정(B-tree가 만들어지는 법)을 그리고, UPDATE(덮어쓰기)·DELETE가 어느 page를 바꾸는지, 왜 WAL에 먼저 쓰는지 예측한다 | btree-lookup | unassessed | | | |
| table-storage | 테이블 row가 PK index leaf 안에 있는 방식(InnoDB, clustered)과 별도 heap 파일에 있는 방식(PostgreSQL)을 그림으로 설명한다 | btree-lookup | unassessed | | | |
| secondary-index | PK가 아닌 컬럼으로 찾을 때 index에 PK를 적는 방식과 row 위치를 적는 방식이 row까지 가는 길을 비교하고, covering이면 무엇이 생략되는지 말한다 | table-storage | claimed | LR-0039 | 2026-11-16 | |
| lsm-crud | LSM에서 CRUD 네 연산이 각각 무엇을 쓰고 읽는지(memtable·SSTable·tombstone·compaction·Bloom filter) 예측한다 | | unassessed | | | |
| lsm-vs-btree | workload가 주어지면 LSM과 B-tree 중 무엇이 유리한지 쓰기 방식·읽기 경로로 근거를 댄다 | btree-write, lsm-crud | unassessed | | | |
