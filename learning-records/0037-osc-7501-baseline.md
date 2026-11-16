# OSC 7501 학습 시작 — 완전 초심자, 조사 정리의 "전체 폐기" 오해 정정

Concept: report-syntax, unassessed → claimed
Date: 2026-11-12

학습자가 직접 조사한 정리를 가져왔고, 스펙 원문(rev 0.4)을 대조해 정정했다. 터미널 escape sequence는 오늘 처음 봤다고 했고(`osc-basics` 프로브에는 답하지 않음 → unassessed 유지), 목적은 "여러 도구가 쓰는 이 프로토콜이 무엇이고 어떻게 동작하는지"이며 emit과 consume 양쪽에 관심이 있다.

**정정한 오해 (조사 정리 → 원문)**
- "규칙을 어기면 보고 전체가 버려진다" → 잘못된 pair는 그 pair만 skip. 전체 폐기는 한도 초과·base64 디코딩 실패·디코딩 결과의 제어문자 3가지뿐.
- "2026년 10월 초에 나온 프로토콜" → 첫 초안 0.1이 2026-09-28.
- 조사 정리에 없던 것: `state=clear`, 보고가 record를 통째로 교체, lifetime 규칙.

Evidence: 조사 정리가 필드·state·wire format을 맞게 적었고 위 정정을 함께 읽음. 본인의 설명이 아니라 조사 결과 인용이므로 `claimed`이며 evidence 아님. aids: 조사 정리 원문. 프로브 `checks/osc-basics.md` v1은 답 없음.

**Implications**
- 레슨은 OSC 기초(번호·본문·종결자)부터 시작한다. 선행지식이 0이므로 용어를 먼저 푼다.
- 연습 순서는 개념 → (마지막에) 직접 실험. 학습자가 명시한 순서다.
- 사용처 표(Codex·cmux·Herdr 등)는 아직 원문 대조 전이다. `ecosystem-map` 레슨에서 검증 후 가르친다.
