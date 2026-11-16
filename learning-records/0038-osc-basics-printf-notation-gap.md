# osc-basics 확인 결과 — printf 표기와 터미널에 가는 byte를 구분하지 못함

Concept: osc-basics, unassessed → needs-repair
Date: 2026-11-12

학습자는 모르는 OSC가 무시된다는 점(2)은 맞췄지만, 종결자를 잘못 짚었고(1) 대체 종결자 질문(3)에 명령에 이미 쓰인 BEL을 답했다. 시퀀스 구조는 이해했으나 `printf` 표기(`\a`, `\e\\`)와 실제 byte를 연결하지 못한다. 다음 레슨에 앞서 이 연결을 고친다.

**교정한 오해:** `\`가 종결자라고 믿음. 실제로 `\a`의 `\`는 printf의 escape 표기이고 터미널에 가지 않는다. 종결자는 BEL(`07`) 한 byte이고, `ESC \`일 때만 `1b 5c` 두 byte가 종결자다.

Evidence: checks/osc-basics.md v2; 답 요지 "(1) ; 이후는 본문, `\`가 종결자 (2) 모르면 넘어간다 (3) BEL?" (번호 7501은 언급 없음); aids: 레슨 퀴즈는 먼저 풀었으나 확인 시점에 레슨은 열지 않음(자기 보고); judged: gap, because Pass when의 (1) 종결자와 (3) `ESC \`가 틀렸고 (2)만 맞음.

**Implications**
- 레슨 0055 §3에 printf 표기 ↔ 실제 byte 대조(`xxd` 출력)를 추가했다. 원래 레슨은 `\e\\`만 풀고 `\a`가 BEL임을 말하지 않았다. 레슨 쪽 결함이기도 하다.
- 재확인은 다음 세션에 바뀐 과제로 한다(예: `printf '\e]7501;state=working\e\\'`의 byte 열을 직접 쓰기).
