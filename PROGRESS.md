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
