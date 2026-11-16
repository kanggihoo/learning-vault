---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "상속이면 Template Method. 합성이면 누가 바꾸는지 본다 — 밖에서 고르면 Strategy, 상태 객체가 스스로 전이하면 State."
destination: youtube
aspect: 1920x1080
language: ko
audience: "GoF 패턴을 시험·실무 양쪽에서 구분하려는 Java 개발자 (본인 복습용)"
length: 90s
angle: concept
narration: no
style_preset: code-editorial
---

## Intent

GoF 23패턴 6편 시리즈의 1편. 레슨 0049(Strategy · State · Template Method)를 시각적으로 설명한다.
사용자 요청: "Gof 23 패턴 내용에 대해서 영상으로 시각적으로 설명해주었으면". 목표는 패턴 소개가 아니라
**구조 신호 두 개로 셋을 판별**하는 것 — ① 상속인가 합성인가 ② 합성이라면 누가 갈아끼우는가.
흐름: 공통 문제(if/switch → 클래스) → 신호 ①② → Strategy(내비) → State(자판기 전이) → Template Method(라면 골격) → 비교표 → 판별 트리.

## Customizations

- 내레이션 없음. 화면 텍스트(키네틱 타이포)와 도식만으로 설명. 핵심 문장·코드는 최소 3~4초 정지.
- 한글 폰트 보강: 제목 Noto Serif KR, 본문 Noto Sans KR. 코드는 프리셋 모노 유지.
- BGM 없음 (완전 무음).

## Notes

- 원본: `lessons/0049-gof-strategy-state-template-method.html`. Spring·JDK 사례(§5)와 퀴즈(§6)는 제외.
- 2~6편(레슨 0050~0054)은 이 브리프·디자인을 재사용한다.
- 렌더 결과는 볼트 `INDEX.md` GoF 섹션에 링크한다.
