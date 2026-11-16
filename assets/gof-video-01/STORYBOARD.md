---
format: 1920x1080
duration: 90s
message: "상속이면 Template Method. 합성이면 누가 바꾸는지 본다 — 밖에서 고르면 Strategy, 상태 객체가 스스로 전이하면 State."
arc: concept-explainer
audience: "GoF 패턴을 시험·실무 양쪽에서 구분하려는 Java 개발자"
mode: autonomous
music: none
language: ko
---

<!-- Silent film: no SCRIPT.md, no narration. `onscreen` carries the exact Korean text the viewer reads, in reveal order. Reveals are paced to READING, not voice: each key line holds ≥3s before the next one arrives. -->

## Video direction

- **palette system** — from `frame.md`: ground = `cream`; card / step surfaces = `tile` / `tile-strong`; all type = `ink`; code panels = warm `navy` code-surface (cream@14% hairline, `navy-elev` title bar with a mono filename); **coral is the ONE voltage per frame** (the frame's single decisive word, arrow, or highlighted row — never two corals). Syntax inside code panels: keywords coral, types amber `#E8A55A`, comments cream@55%.
- **type** — display/headline = EB Garamond → Noto Serif KR, weight 400, sentence case. Body/labels = Inter → Noto Sans KR. Kicker = JetBrains Mono uppercase with the coral ✱ spike (`✱ STRATEGY · 전략`). Code = JetBrains Mono. `@font-face` block + stacks: `frame.md` § Project Overrides. Korean is the primary reading text — never smaller than the `lead` step for anything the viewer must read.
- **recurring stage** — frames 3–5 share ONE stage so they read as one continuous shot under `push-slide LEFT`: left 55% = the analogy diagram (a "본체" box with a slot + the parts that fill it), right 45% = a stacked rail: kicker → headline (the pattern's one-line rule) → code-surface card → signal tags row (three hairline pills: 관계 · 교체 시점 · 누가 바꾸나). Same positions in all three frames; only the content changes.
- **decision tree** — frames 2 and 7 draw the SAME tree at the same position and scale (root question node top-center, two branches, three leaves) so frame 7 reads as a callback. Nodes = tile cards with hairline; connectors = 1px ink hairlines drawn via svg self-draw; the decisive branch label is the frame's coral.
- **motion grammar** — smooth long-tail `power3` settles, no overshoot/bounce. Entrances are `fromTo` (short rise + fade, or svg self-draw for connectors). Reveal model: nothing appears before its reading beat; each reveal waits for the previous line to have been readable for ≥3s. Holds stay still — at most a subtle jitter, never breathing, never a back-half camera pan/push.
- **rhythm / held frames** — frames 1–5 develop; frame 6 (table) is a slower build with a long still read; frame 7's last ~5s is the film's deliberate held landing. Frame 2 ends with a 2s held read of the empty-leaf tree.
- **negative list** — no slideshow (front-load then freeze), no screensaver (independent floating), no bokeh / purple-blue AI gradients / glow / heavy shadows / tilts, no cursor, no fake editor chrome (no activity bar, tabs, terminals), no invented numbers, no second coral. Content stays in the top ~83% (bottom band kept clear).

## Frame 1 — 셋 다 닮았다

- scene: 세 개의 짧은 Java 코드 카드가 나란히 떠오르고, 각 카드 위 이름표가 "?"로 비어 있다
- voiceover: ""
- onscreen: "코드는 닮았는데" → "이름은 셋이다" → 이름표 ? ? ?
- duration: 7s
- transition_in: cut
- status: animated
- src: compositions/frames/01-look-alike.html
- type: hook
- persuasion: Pain validation + Counterexample (같아 보이는 셋)
- beat: puzzlement + recognition
- blueprint: compose
- focal: 세 장의 나란한 코드 카드 (각 카드 위에 빈 "?" 이름표)
- roles: 세 코드 카드 = foreground subject · 상단 헤드라인 = supporting · cream 바탕 + 아주 옅은 hairline 그리드 = background (opacity ~30%)

narrativeRole: 시청자가 이미 겪는 혼란("코드를 봐도 이름이 안 떠오른다")을 그대로 보여 주며 질문을 연다.
keyMessage: Strategy·State·Template Method는 모두 if/switch 분기를 클래스로 뺀 것이라 코드가 닮았고, 그래서 헷갈린다.

Compose: kinetic headline + triptych of code cards; the payoff is the row of three "?" tags.
Scene 1 (0.0–2.2s): cream field with faint hairline grid. Headline "코드는 닮았는데" (display, centered upper-third) enters via **per-word staggered reveal** (`dynamic-content-sequencing`). Below it, triptych of three navy code-surface cards rises in with a short stagger (`dynamic-content-sequencing`), each holding 2 lines verbatim from the source: card A `private RouteStrategy strategy;` / `strategy.find(a, b);` · card B `private VendingState state;` / `state = state.pressButton();` · card C `abstract void addSoup();` / `final void cook() { … }`. Triptych ~60% width, 3 depth layers.
Scene 2 (2.2–4.4s): headline line 2 "이름은 셋이다" arrives under line 1 via **hard-cut word-swap** feel (`discrete-text-sequence`), coral on "셋".
Scene 3 (4.4–7.0s): a hairline name tag with a large "?" pops above each card left→right (`spring-pop-entrance`, smooth settle, no overshoot); the frame holds still to the end — subtle jitter at most.

## Frame 2 — 신호 두 개면 된다

- scene: 판별 트리의 뼈대가 그려진다 — 질문 노드 ① 상속인가 합성인가, ② 누가 갈아끼우는가, 잎 세 칸은 아직 "?"
- voiceover: ""
- onscreen: "구조 신호 두 개만 본다" → "① 상속인가, 합성인가" → "② 합성이라면 — 누가 갈아끼우는가"
- duration: 11s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-two-signals.html
- type: product_intro
- persuasion: Frame-then-fill (트리 모양을 먼저 보이고 잎은 비워 둔다) + Numbered enumeration
- beat: clarity + anticipation
- blueprint: compose
- focal: 판별 트리 (질문 노드 2개 + 빈 잎 3개)
- roles: 트리 = foreground subject (~55% of frame) · 상단 헤드라인 = supporting · cream 바탕 + hairline 그리드 = background

narrativeRole: 영상 전체의 판별 도구를 먼저 꺼내 놓는다. 이후 세 프레임이 이 트리의 잎을 하나씩 채운다.
keyMessage: 셋을 가르는 데 필요한 건 신호 두 개 — 상속/합성, 그리고 교체 주체.

Tree geometry (shared with Frame 7): root node ① top-center; left branch label "상속" → leaf L (bottom-left); right branch label "합성" → node ② (middle-right); node ② splits "밖에서" → leaf M and "스스로" → leaf R (bottom-right pair). Leaves are tile cards showing "?".
Scene 1 (0.0–3.0s): headline "구조 신호 두 개만 본다" (headline step, top-left rail) enters via **per-word staggered reveal** (`dynamic-content-sequencing`); kicker "✱ 판별 도구" above it. Nothing else yet.
Scene 2 (3.0–6.0s): root node ① "상속인가, 합성인가" springs into place (`spring-pop-entrance`); its two branch connectors **svg self-draw** (`svg-path-draw`) downward with labels "상속" / "합성"; the "상속" leaf L appears as an empty "?" tile.
Scene 3 (6.0–9.0s): node ② "합성이라면 — 누가 갈아끼우는가" springs in at the end of the 합성 branch (coral number ②); its two connectors self-draw to leaves M ("밖에서") and R ("스스로"), both "?" tiles.
Scene 4 (9.0–11.0s): complete skeleton holds still — the empty leaves are the question the next three frames answer.

## Frame 3 — Strategy: 밖에서 갈아끼운다

- scene: 내비게이션 본체(Navi) 옆으로 "최단 · 무료 · 고속" 칩이 놓여 있고, 바깥 손(클라이언트)이 칩 하나를 집어 본체 슬롯에 끼운다; 아래 코드 카드에 합성 필드와 setStrategy 줄이 강조된다
- voiceover: ""
- onscreen: kicker "STRATEGY · 전략" → "밖에서 갈아끼운다" → 코드 `private RouteStrategy strategy; // 합성` · `void setStrategy(RouteStrategy s) // 밖에서 교체` → 태그 "합성 · 실행 중 교체 · 바꾸는 쪽 = 클라이언트"
- duration: 15s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-strategy.html
- type: feature_showcase
- persuasion: Analogy (내비 경로 옵션) + Demonstration (칩 교체를 실제로 보여 줌)
- beat: comprehension
- blueprint: compose
- focal: Navi 본체 박스의 슬롯 + 그 슬롯으로 끼워지는 경로 칩
- roles: Navi 본체 + 칩 3개 = foreground subject (left 55%) · 오른쪽 레일(kicker·헤드라인·코드 카드·태그) = supporting · cream 바탕 = background

narrativeRole: 트리의 첫 잎 "합성 + 밖에서"를 구체적인 사물로 만든다.
keyMessage: Context는 인터페이스를 필드로 들고, 어떤 구현을 쓸지는 바깥(클라이언트)이 고른다.

Stage: the recurring stage (Video direction). Left: a large tile box labeled "Navi" with an inset dashed slot labeled "RouteStrategy"; to its left, outside the box, a small mono label "클라이언트" with three pill chips stacked: "최단", "무료", "고속".
Scene 1 (0.0–3.0s): kicker "✱ STRATEGY · 전략" and headline "밖에서 갈아끼운다" (headline step, right rail) enter via **per-word staggered reveal** (`dynamic-content-sequencing`); the Navi box with its empty slot rises in on the left.
Scene 2 (3.0–6.5s): the three chips appear outside the box under "클라이언트" (staggered rise); chip "최단" travels into the slot and seats (smooth `power3` move); a coral arrow labeled "밖에서 교체" draws from 클라이언트 to the slot (`svg-path-draw`) — this frame's one coral.
Scene 3 (6.5–10.0s): chip "최단" slides out and "고속" slides in — the swap itself demonstrates run-time replacement. The navy code card appears in the right rail, lines revealing one by one (`dynamic-content-sequencing`): `class Navi {` · `private RouteStrategy strategy;  // 합성` · `void setStrategy(RouteStrategy s) { this.strategy = s; }  // 밖에서 교체` · `}`.
Scene 4 (10.0–15.0s): the signal tags row fills left→right: "관계: 합성" · "교체: 실행 중" · "누가: 클라이언트" (staggered pill reveal); hold still to the end.

## Frame 4 — State: 안에서 스스로 바뀐다

- scene: 같은 무대 구성(본체 + 슬롯)을 자판기로 바꿔, 같은 "버튼 누르기"가 NoCoin → HasCoin → NoCoin 상태 노드를 따라 다르게 동작한다; 전이 화살표는 상태 노드 자신에게서 나온다
- voiceover: ""
- onscreen: kicker "STATE · 상태" → "안에서 스스로 바뀐다" → 상태 노드 "동전 없음 / 동전 있음" + 같은 호출 `pressButton()` → 코드 `return new NoCoin(); // 스스로 전이` → 태그 "합성 · 실행 중 교체 · 바꾸는 쪽 = 상태 객체 자신"
- duration: 15s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/04-state.html
- type: feature_showcase
- persuasion: Analogy (자판기) + Before/after (같은 버튼, 다른 결과) + Comparison with Frame 3 (구조는 같고 교체 주체만 다르다)
- beat: "aha"
- blueprint: compose
- focal: 자판기 본체 슬롯 안의 상태 카드가 스스로 다음 상태 카드로 바뀌는 순간 (화살표가 상태 카드 자신에게서 나온다)
- roles: 자판기 본체 + 상태 카드 2개 = foreground subject (left 55%) · 오른쪽 레일 = supporting · cream 바탕 = background

narrativeRole: Strategy와 코드 모양이 같다는 것을 인정한 뒤, 교체 주체만 다르다는 차이를 눈으로 보이게 한다.
keyMessage: 구조는 Strategy와 거의 같지만, 다음 상태를 정하는 건 상태 객체 자신이고 상태끼리 서로를 안다.

Stage: identical positions to Frame 3. Left: tile box labeled "자판기" with the same dashed slot labeled "VendingState"; a mono button label `pressButton()` under the box. NO 클라이언트 chips outside — the outside is deliberately empty.
Scene 1 (0.0–3.0s): kicker "✱ STATE · 상태" + headline "안에서 스스로 바뀐다" enter (`dynamic-content-sequencing`); the 자판기 box rises in with state card "동전 없음" already seated in the slot.
Scene 2 (3.0–6.5s): the `pressButton()` label presses (`press-release-spring`, smooth) and a small result line appears beside the box: "→ 동전을 넣으세요". Then a mono label "동전 투입" and the state card flips to "동전 있음" — the transition arrow draws FROM the seated state card to the new one (`svg-path-draw`), coral, labeled "스스로 전이" — this frame's one coral.
Scene 3 (6.5–10.0s): `pressButton()` presses again; result line now reads "→ 음료 배출" (same call, different result), and the card returns to "동전 없음" along a second arrow from the state card itself. Navy code card reveals line by line in the right rail: `class HasCoin implements VendingState {` · `public VendingState pressButton() {` · `return new NoCoin();  // 스스로 전이` · `} }`.
Scene 4 (10.0–15.0s): signal tags row fills: "관계: 합성" · "교체: 실행 중" · "누가: 상태 객체 자신" (the third pill differs from Frame 3 — underline it with a hairline marker, `css-marker-patterns`); hold still.

## Frame 5 — Template Method: 순서는 부모, 일부는 자식

- scene: 라면 끓이기 4단계 레일(물 끓이기 → 면 → 스프 → 먹기)이 고정되어 있고, "스프" 칸만 비어 있다가 자식 클래스(신라면)가 채운다; 부모→자식 상속 화살표
- voiceover: ""
- onscreen: kicker "TEMPLATE METHOD · 템플릿 메서드" → "순서는 부모, 일부는 자식" → 코드 `final void cook() { boilWater(); addNoodle(); addSoup(); serve(); }` · `abstract void addSoup();` → 태그 "상속 · 컴파일 시점 고정 · 실행 중엔 못 바꾼다"
- duration: 14s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-template-method.html
- type: feature_showcase
- persuasion: Analogy (라면 조리 순서) + Contrast (합성 두 개 뒤에 나오는 유일한 상속)
- beat: confidence
- blueprint: compose
- focal: 4칸 조리 레일에서 비어 있는 "스프" 칸이 자식 클래스로 채워지는 순간
- roles: 부모 박스 "Ramen" + 4칸 레일 + 자식 박스 "ShinRamen" = foreground subject (left 55%) · 오른쪽 레일 = supporting · cream 바탕 = background

narrativeRole: 트리의 다른 가지 "상속"을 채운다 — 셋 중 유일하게 상속이라는 점이 가장 빠른 판별 신호임을 보인다.
keyMessage: 부모가 알고리즘 골격을 final로 고정하고, 변하는 단계만 추상 메서드로 남겨 자식이 채운다.

Stage: same positions, but the left box is now a parent class "Ramen" containing a horizontal 4-step rail (four small tile cells joined by hairline arrows): "물 끓이기" → "면" → "스프" → "먹기". Below it, a child box "ShinRamen" connected by a vertical inheritance arrow (hollow triangle head, UML style).
Scene 1 (0.0–3.0s): kicker "✱ TEMPLATE METHOD · 템플릿 메서드" + headline "순서는 부모, 일부는 자식" enter (`dynamic-content-sequencing`); the Ramen box rises in and its four cells appear left→right in order, "스프" cell drawn as an empty dashed cell labeled `abstract`.
Scene 2 (3.0–6.5s): a small mono lock label "final" settles onto the rail (the order is fixed). The child box "ShinRamen" rises in below; the inheritance arrow self-draws upward (`svg-path-draw`) — coral, labeled "상속" — this frame's one coral.
Scene 3 (6.5–10.0s): a filled cell "매운 스프" travels from ShinRamen up into the empty 스프 slot and seats; only that one cell changes. Navy code card reveals line by line: `abstract class Ramen {` · `final void cook() { boilWater(); addNoodle(); addSoup(); serve(); }` · `abstract void addSoup();  // 이 단계만 자식이` · `}`.
Scene 4 (10.0–14.0s): signal tags row fills: "관계: 상속" · "교체: 컴파일 시점 고정" · "누가: 바꾸지 않음"; hold still.

## Frame 6 — 한 장으로 구분

- scene: 세 열(Strategy · State · Template Method) × 네 행(관계 · 교체 시점 · 누가 바꾸나 · 부품끼리)의 비교표가 행 단위로 채워진다; 판별에 결정적인 두 행만 코랄 강조
- voiceover: ""
- onscreen: 표 — 관계: 합성 / 합성 / 상속 · 교체 시점: 실행 중 / 실행 중 / 컴파일 시점 · 누가 바꾸나: 외부(클라이언트) / 상태 객체 스스로 / 바꾸지 않음 · 부품끼리: 서로 모른다 / 서로 안다 / 해당 없음
- duration: 14s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-compare-table.html
- type: social_proof
- persuasion: Comparison of options + Progressive disclosure (행 단위)
- beat: mastery
- blueprint: grid-card-assemble (Adapt)
- focal: 3열 × 4행 비교표
- roles: 비교표 = foreground subject (~65% width, centered) · 상단 헤드라인 "한 장으로 구분" = supporting · cream 바탕 = background

narrativeRole: 앞의 세 프레임에서 본 신호를 한 표로 모아, 시험 지문과 코드 리뷰에서 바로 대조할 수 있게 한다.
keyMessage: "관계"와 "누가 바꾸나" 두 행만 보면 셋이 갈린다.

Adapt: keep the staggered self-assemble into a grid; items are table rows (a list-line per row, ~1 row per 2s reading pace) instead of feature tiles; no camera zoom, no float.
Scene 1 (0.0–2.0s): kicker "✱ 한 장으로" + headline "한 장으로 구분" (top rail); the table frame with its three column headers "Strategy · State · Template Method" (display step, EB Garamond) assembles left→right.
Scene 2 (2.0–10.0s): the four rows assemble one at a time, ~2s apart (`dynamic-content-sequencing`), each row's label cell first then its three cells left→right: "관계" · "교체 시점" · "누가 바꾸나" · "부품끼리". Body text on tile rows with hairline separators.
Scene 3 (10.0–14.0s): the "관계" and "누가 바꾸나" rows get a coral left-edge marker + slight tile-strong fill (`css-marker-patterns`); the other two rows dim to ~55%. Small caption under the table: "이 두 줄만 보면 갈린다". Hold still.

## Frame 7 — 판별 트리 완성

- scene: Frame 2의 판별 트리로 돌아와 빈 잎 세 칸이 Template Method · Strategy · State로 채워지고, 아래에 한 문장 결론이 놓인다
- voiceover: ""
- onscreen: 트리 잎 채움 → "상속이면 Template Method." → "합성이면 누가 바꾸는지 본다 —" → "밖에서 고르면 Strategy, 스스로 전이하면 State." → 꼬리표 "GoF 1/6 · 다음: Decorator · Proxy · Adapter"
- duration: 13s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-decision-tree.html
- type: branding
- persuasion: Callback (Frame 2의 빈 트리) + Distillation (한 문장 회수)
- beat: "now I get it"
- blueprint: titlecard-reveal (Adapt)
- focal: 잎이 채워진 판별 트리 → 그 아래 한 문장 결론
- roles: 트리 = foreground subject (upper ~55%) · 결론 문장 = foreground (lower) · 꼬리표 = supporting · cream 바탕 = background

narrativeRole: 처음 꺼낸 도구를 완성된 상태로 돌려주며 메시지를 한 문장으로 각인시킨다.
keyMessage: 상속이면 Template Method, 합성이면 밖에서 고르면 Strategy, 스스로 전이하면 State.

Adapt: keep the ONE restrained landing move + long still hold (the signature calm card); the card is the conclusion sentence under a callback tree.
Scene 1 (0.0–1.0s): the Frame 2 tree is already present at the same geometry, all three leaves still "?" (it reads as the same object returning). Scale the whole tree to ~80% and seat it in the upper ~55%.
Scene 2 (1.0–5.5s): leaves fill one at a time, each "?" swapping in place (`discrete-text-sequence`): leaf L → "Template Method" (1.0s), leaf M → "Strategy" (2.5s), leaf R → "State" (4.0s).
Scene 3 (5.5–8.5s): the conclusion card slides up + crossfades in below the tree (the one restrained move): quote-pull step, two lines — "상속이면 Template Method." / "합성이면 누가 바꾸는지 본다 — 밖에서 고르면 Strategy, 스스로 전이하면 State." Coral on "누가 바꾸는지" — this frame's one coral.
Scene 4 (8.5–13.0s): small mono tag fades in bottom-right: "GoF 1/6 · 다음: Decorator · Proxy · Adapter". Everything holds still to the end; final ~0.6s gentle fade of the whole frame to cream (the film's only exit).
