# Frame packet: 04-state

## Project inputs

- Project: /Users/kkh/Desktop/learning-vault/assets/gof-video-01
- Design tokens: /Users/kkh/Desktop/learning-vault/assets/gof-video-01/frame.md
- RULES_DIR: /Users/kkh/Desktop/learning-vault/.agents/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 4 — State: 안에서 스스로 바뀐다

- scene: 같은 무대 구성(본체 + 슬롯)을 자판기로 바꿔, 같은 "버튼 누르기"가 NoCoin → HasCoin → NoCoin 상태 노드를 따라 다르게 동작한다; 전이 화살표는 상태 노드 자신에게서 나온다
- voiceover: ""
- onscreen: kicker "STATE · 상태" → "안에서 스스로 바뀐다" → 상태 노드 "동전 없음 / 동전 있음" + 같은 호출 `pressButton()` → 코드 `return new NoCoin(); // 스스로 전이` → 태그 "합성 · 실행 중 교체 · 바꾸는 쪽 = 상태 객체 자신"
- duration: 15s
- transition_in: push-slide LEFT
- status: outline
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

## Selected motion rule: css-marker-patterns

# CSS Patterns for Marker Highlighting

## Contents

- [1. Highlight Mode](#1-highlight-mode)
- [2. Circle Mode](#2-circle-mode)
- [3. Burst Mode](#3-burst-mode)
- [4. Scribble Mode](#4-scribble-mode)
- [5. Sketchout Mode](#5-sketchout-mode)
- [Combining Modes in Captions](#combining-modes-in-captions)

Pure CSS + GSAP implementations of all five MarkerHighlight.js drawing modes — no external library dependency, full timeline control. Snippets show mechanism DOM only, inside a standard scene clip (hyperframes-core); assume `tl` exists.

Shared scaffold for every mode: the wrap is `position: relative; display: inline`; the text copy is `position: relative` and z-indexed **above** the accent (below it for sketchout, where the lines cross the text).

## 1. Highlight Mode

Yellow marker sweep behind text — the most common mode.

```html
<span class="mh-highlight-wrap">
  <span class="mh-highlight-bar" id="hl-1"></span>
  <span class="mh-highlight-text">highlighted text</span>
</span>
```

```css
.mh-highlight-bar {
  position: absolute;
  inset: 0 -6px; /* bleed past the text edges */
  background: #fdd835;
  opacity: 0.35;
  transform: scaleX(0);
  transform-origin: left center;
  border-radius: 3px;
  z-index: 0;
}
```

```js
tl.to("#hl-1", { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.6);
// Optional hand-drawn skew: gsap.set("#hl-1", { skewX: -2 });
// Multi-line: tl.to(".mh-highlight-bar", { scaleX: 1, ..., stagger: 0.3 }, 0.6);
```

## 2. Circle Mode

Hand-drawn ellipse around text — `border-radius: 50%` plus a slight rotation for organic feel.

```html
<span class="mh-circle-wrap">
  <span class="mh-circle-text">IMPORTANT</span>
  <span class="mh-circle-ring" id="circle-1"></span>
</span>
```

```css
.mh-circle-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130%; /* tight (short words): 150%; rounded-rect: 120% + border-radius: 30% */
  height: 160%;
  transform: translate(-50%, -50%) rotate(-3deg) scale(0);
  border: 3px solid #e53935;
  border-radius: 50%;
  z-index: 0;
}
```

```js
tl.to("#circle-1", { scale: 1, rotation: -3, duration: 0.6, ease: "back.out(1.7)" }, 0.7);
```

## 3. Burst Mode

Radiating lines from text center — each line a positioned span rotated to its angle. Use ~12 lines at 30° steps and **vary `--len` (40–80px)**; equal lengths look mechanical.

```html
<span class="mh-burst-wrap">
  <span class="mh-burst-text">WOW</span>
  <span class="mh-burst-container" id="burst-1">
    <span class="mh-burst-line" style="--angle: 0deg; --len: 70px;"></span>
    <span class="mh-burst-line" style="--angle: 30deg; --len: 55px;"></span>
    <!-- …one line per 30° step through 330deg, --len varied 40-80px -->
  </span>
</span>
```

```css
.mh-burst-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 1; /* text copy at z-index: 2 */
}
.mh-burst-line {
  position: absolute;
  display: block;
  width: 3px;
  height: var(--len);
  background: #1e88e5;
  left: -1.5px;
  top: calc(-1 * var(--len));
  transform: rotate(var(--angle));
  transform-origin: bottom center;
  opacity: 0;
}
```

```js
tl.fromTo(
  "#burst-1 .mh-burst-line",
  { scaleY: 0, opacity: 0 },
  { scaleY: 1, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.03 },
  0.7,
);
```

## 4. Scribble Mode

Wavy SVG underline that draws itself via `stroke-dashoffset`.

```html
<span class="mh-scribble-wrap">
  <span class="mh-scribble-text">underlined text</span>
  <svg class="mh-scribble-svg" viewBox="0 0 500 24" preserveAspectRatio="none">
    <path
      id="scribble-1"
      d="M0,12 Q31,0 62,12 Q93,24 125,12 Q156,0 187,12 Q218,24 250,12 Q281,0 312,12 Q343,24 375,12 Q406,0 437,12 Q468,24 500,12"
      fill="none"
      stroke="#FDD835"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</span>
```

```css
.mh-scribble-svg {
  position: absolute;
  left: 0;
  bottom: -6px; /* strikethrough variant: top: 50%; transform: translateY(-50%) */
  width: 100%;
  height: 24px;
  z-index: 0;
}
```

```js
const path = document.querySelector("#scribble-1");
const len = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
tl.to("#scribble-1", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, 0.7);
```

Path tuning: the `Q` control points alternate y between 0 and 24 for a natural wobble. Tighter waves = smaller x-increments (~25px per half-wave); looser = ~50px; subtler amplitude = y range 0–16.

## 5. Sketchout Mode

Cross-hatch over de-emphasized text — two angled lines create a "crossed out" effect.

```html
<span class="mh-sketchout-wrap">
  <span class="mh-sketchout-text">old price</span>
  <span class="mh-sketchout-lines" id="sketchout-1">
    <span class="mh-sketchout-line mh-sketchout-fwd"></span>
    <span class="mh-sketchout-line mh-sketchout-bwd"></span>
  </span>
</span>
```

```css
.mh-sketchout-lines {
  position: absolute;
  inset: 0 -4px;
  overflow: hidden;
  z-index: 1; /* text at z-index: 0 — the lines cross OVER it */
}
.mh-sketchout-line {
  position: absolute;
  display: block;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: #e53935;
  transform-origin: left center;
}
.mh-sketchout-fwd {
  transform: scaleX(0) rotate(-12deg);
}
.mh-sketchout-bwd {
  transform: scaleX(0) rotate(12deg);
}
```

```js
// Forward slash first, backward follows
tl.to("#sketchout-1 .mh-sketchout-fwd", { scaleX: 1, duration: 0.3, ease: "power2.out" }, 1.0);
tl.to("#sketchout-1 .mh-sketchout-bwd", { scaleX: 1, duration: 0.3, ease: "power2.out" }, 1.15);
```

## Combining Modes in Captions

Cycle modes across caption groups for visual variety — every 2-3 groups for high energy, 3-4 for medium, 4-5 for low:

```js
const MODES = ["highlight", "circle", "burst", "scribble"];
GROUPS.forEach((group, gi) => {
  const mode = MODES[gi % MODES.length];
  group.emphasisWords.forEach((word) => applyMode(word.el, mode, tl, word.start));
});
```

## Selected motion rule: dynamic-content-sequencing

---
name: dynamic-content-sequencing
description: Auto-calculate timeline start/end times from content length + per-item duration config — longer content gets more screen time without hardcoded numbers.
metadata:
  tags: timeline, sequencing, dynamic, duration, content-aware, utility
---

# Dynamic Content Sequencing

## Contents

- [How It Works](#how-it-works)
- [Recipe](#recipe)
- [Variations](#variations)
- [Values](#values)
- [Critical Constraints](#critical-constraints)
- [See also](#see-also)

A utility pattern (not a motion rule in itself) for scenes that show a SEQUENCE of items (cards, phrases, stats): each item's duration is computed from its content length + per-item config, and the sequencer assigns absolute start/end times automatically — no hardcoded offsets per item. Distinct from [discrete-text-sequence](discrete-text-sequence.md) (one text element changing states) — this rule swaps between distinct content blocks.

## How It Works

A content array of `{ eyebrow, title, body, speedFactor, hold }` entries is reduced once at build time into a flat `TIMELINE` of `{ …entry, start, end }` — duration per entry is `BASE_DURATION + body.length × SEC_PER_CHAR + hold`, so longer text earns more reading time. A single linear driver's `onUpdate` reverse-searches the active entry and swaps the DOM **only on transitions** (a `lastTitle` guard — per-frame `textContent` writes flicker in render); an optional progress bar fills 0→100% across the whole run.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="display">
  <div class="eyebrow" id="eyebrow"></div>
  <div class="title" id="title"></div>
  <div class="body" id="body"></div>
  <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
</div>
```

```css
.body {
  min-height: 160px; /* reserve space — content height varies; without this, layout jumps */
}
.progress-fill {
  height: 100%;
  width: 0%;
}
```

```js
// N entries, each with its own pacing (optionally a speedFactor multiplier);
// the final entry uses a larger hold (closing beat).
const CONTENT = [
  { eyebrow: "{eyebrow1}", title: "{title1}", body: "{body1}", hold: HOLD_MID },
  // …
  { eyebrow: "{eyebrowN}", title: "{titleN}", body: "{bodyN}", hold: HOLD_FINAL },
];

// Pre-compute absolute start/end ONCE — never in onUpdate.
let cumulative = 0;
const TIMELINE = CONTENT.map((entry) => {
  const dur = BASE_DURATION + entry.body.length * SEC_PER_CHAR + entry.hold;
  const start = cumulative;
  cumulative += dur;
  return { ...entry, start, end: cumulative };
});

function entryAt(time) {
  for (let i = TIMELINE.length - 1; i >= 0; i--) {
    if (time >= TIMELINE[i].start) return TIMELINE[i];
  }
  return TIMELINE[0];
}

const eyebrowEl = document.getElementById("eyebrow");
const titleEl = document.getElementById("title");
const bodyEl = document.getElementById("body");
const progressEl = document.getElementById("progress-fill");

const TOTAL_DURATION = cumulative + TAIL_PAD;
const driver = { t: 0 };
let lastTitle = "";

tl.to(
  driver,
  {
    t: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      const entry = entryAt(driver.t);
      // Swap content only on transitions — no per-frame DOM thrash
      if (entry.title !== lastTitle) {
        eyebrowEl.textContent = entry.eyebrow;
        titleEl.textContent = entry.title;
        bodyEl.textContent = entry.body;
        lastTitle = entry.title;
      }
      progressEl.style.width = `${(driver.t / TOTAL_DURATION) * 100}%`;
    },
  },
  0,
);
```

## Variations

- **Crossfade between items** — return BOTH adjacent entries during an overlap window (`time ≥ e.start − overlap && time ≤ e.end + overlap`, overlap ≈ 0.3s) and render them with opacities computed from distance to the boundary.
- **Per-item motion variation** — map an `entry.style` key to an existing rule per chapter (e.g. `3d-text-depth-layers` → `hacker-flip-3d` → `counting-dynamic-scale`); the sequencer only orchestrates timing.
- **Auto-extend composition duration** — you can set `data-duration` from the computed `TOTAL_DURATION` in script, but HF reads `data-duration` at composition load and setting it after init may not take effect — author the duration manually from a rough total.

### Accelerating cadence (geometric hold decay)

For rhetorical escalation — "everyone says…", a roll-call, a praise flurry — the beat grid itself accelerates: early entries hold ~1s (read speed), then windows shrink geometrically into a ~0.15–0.3s flurry, braking on an emphasis state before the resolve. The acceleration is pre-computed into the same flat `TIMELINE` — still content-driven, still deterministic, no speed-up tween anywhere:

```js
// Geometric decay on the hold, clamped at a flurry floor; the brake state holds longest.
const HOLDS = CONTENT.map((entry, i) => Math.max(FLURRY_FLOOR, HOLD_START * Math.pow(DECAY, i)));
HOLDS[CONTENT.length - 1] = HOLD_FINAL;

let cumulative = 0;
const TIMELINE = CONTENT.map((entry, i) => {
  // Past ~0.5s states are glanced as motion texture, not read —
  // drop the per-char term or you never reach flurry speed.
  const readable = HOLDS[i] >= READ_THRESHOLD;
  const dur = HOLDS[i] + (readable ? entry.body.length * SEC_PER_CHAR : 0);
  const start = cumulative;
  cumulative += dur;
  return { ...entry, start, end: cumulative };
});
```

Worked example — **praise-chip flurry**: ~16 short quotes hard-cut through a chip beside a pinned wordmark. First 3 states at `HOLD_START = 1.0` (each reads fully); `DECAY = 0.8` shrinks every following window until `FLURRY_FLOOR = 0.2` catches it (≈12 states over ~2.5s — a churn of acclaim, individually glanced); the longest phrase takes `HOLD_FINAL ≈ 1.6` as the brake before the closing lockup.

Values: `HOLD_START` 0.8–1.2s; `DECAY` 0.75–0.88 (higher = longer runway before the flurry bites); `FLURRY_FLOOR` 0.15–0.3s (below ~0.15s swaps strobe); `READ_THRESHOLD` ~0.5s; brake ≥ 4× the floor or the stop doesn't register as a beat. The 3–6 entry guidance relaxes here — 12–18 states are legal precisely because flurry states aren't individually read. The hard-cut discipline (`lastTitle` guard, instant swaps) is what lets 0.2s states render clean.

## Values

| token         | range                 | notes                                                                                                                 |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| BASE_DURATION | 0.6–1.5s              | minimum per entry regardless of length — even one-word entries get read time                                          |
| SEC_PER_CHAR  | 0.03–0.06 s/char      | ≈17–33 chars/sec; uniform across the sequence so the pace reads as one engine; lean high for wide-character languages |
| HOLD_MID      | 0.5–1.0s              | dwell on a non-final entry; `< HOLD_FINAL`                                                                            |
| HOLD_FINAL    | 1.0–2.0s              | climax dwell — must exceed HOLD_MID by a clear margin so the close reads as a beat                                    |
| SPEED_FACTOR  | 0.5–2.0 (default 1.0) | per-entry only; if every entry shares a factor, fold it into SEC_PER_CHAR                                             |
| TAIL_PAD      | 0.0–1.0s              | quiet beat after the last entry; prefer 0 when the next composition owns the breath                                   |
| CONTENT N     | 3–6 entries           | <3 isn't a sequence; >6 drags (accelerating cadence relaxes this — see above)                                         |

Reference: `../examples/messaging-multi-phrase.html`.

## Critical Constraints

- **Pre-compute the TIMELINE once at build** — never recompute in `onUpdate`; the reverse search over the flat array is the whole per-frame cost.
- **DOM swap only on entry transition** (`lastTitle`/key guard) — per-frame `textContent` assignment flickers in HF render.
- **`min-height` on the body element** — without reservation, downstream elements (progress bar, brand) jitter as content height varies.
- **Sequential only** — for parallel tracks use a different reduction.
- **Titles fit one line at the chosen size; bodies fit inside `min-height` after wrapping.**

## See also

`discrete-text-sequence` (per-entry typewriter on the body) · `context-sensitive-cursor` (cursor color per chapter) · `vertical-spring-ticker` (animated word swap instead of hard cut) · `scale-swap-transition` (visual morph between entries).

## Selected motion rule: press-release-spring

---
name: press-release-spring
description: Tactile button press with linear compression, spring-based elastic recovery, and layered visual feedback (shadow shrink + release burst + background glow).
metadata:
  tags: spring, press, interaction, button, physics, glow, burst, ui
---

# Press-Release Spring Chain

## Contents

- [Recipe](#recipe)
- [Variations](#variations)
- [Values](#values)
- [Critical Constraints](#critical-constraints)
- [See also](#see-also)

Separates input (linear compression) from output (spring recovery) to create tactile feel: the overshoot is a natural byproduct of the spring config, not manually coded, with secondary motion (shadow shrink, release burst, background glow) layered on the same trigger frame. This is a **reaction on an element already resting on screen** — an arrival that springs in from nothing is [spring-pop-entrance.md](spring-pop-entrance.md); add a visible cursor actor and it becomes [physics-press-reaction.md](physics-press-reaction.md).

Two phases split at the **release**:

1. **Press**: linear ease → compression (`scale: 1 → PRESS_SCALE`, shadow shrinks). Linear, not spring — the dip must read as instant/tactile, not squishy.
2. **Release**: `back.out(BOUNCE_FACTOR)` spring back to 1.0. Optional burst glow ring expands behind the button; optional environmental glow fades in.

State continuity is critical: the release tween's start value MUST equal the press tween's end value, or the spring snaps to a different position. GSAP threads this automatically when both tweens target the same property at **adjacent positions** — `RELEASE_START = PRESS_START + PRESS_DUR`; a gap or overlap breaks it.

## Recipe

```html
<div class="press-stage">
  <div class="bg-glow" id="bg-glow"></div>
  <!-- Burst sits BEHIND the button (z-index 1 vs 2), same footprint, blurred
       radial gradient, opacity 0. bg-glow is a full-stage radial at negative
       inset so it extends past the stage edges. -->
  <div class="burst" id="burst"></div>
  <button class="btn" id="btn">{buttonLabel}</button>
</div>
```

```js
// Phase 1 — press (linear compression)
tl.to(
  "#btn",
  { scale: PRESS_SCALE, boxShadow: "{btnPressedShadow}", duration: PRESS_DUR, ease: "power1.in" },
  PRESS_START,
);

// Phase 2 — release (spring back; start scale == PRESS_SCALE by adjacency)
tl.to(
  "#btn",
  {
    scale: 1,
    boxShadow: "{btnRestShadow}",
    duration: RELEASE_DUR,
    ease: `back.out(${BOUNCE_FACTOR})`,
  },
  RELEASE_START,
);

// Phase 3 — burst glow pops behind the button, then fades
tl.fromTo(
  "#burst",
  { scale: 1, opacity: 0 },
  {
    scale: BURST_PEAK_SCALE,
    opacity: BURST_PEAK_OPACITY,
    duration: BURST_GROW_DUR,
    ease: "power2.out",
  },
  RELEASE_START,
);
tl.to("#burst", { opacity: 0, duration: BURST_FADE_DUR, ease: "power2.in" }, BURST_FADE_START);

// Phase 4 — environmental glow fades in after release
tl.to(
  "#bg-glow",
  { opacity: BG_GLOW_PEAK_OPACITY, duration: BG_GLOW_FADE_DUR, ease: "power2.out" },
  RELEASE_START,
);
```

## Variations

- **Subtle press** (status save / muted CTA): `PRESS_SCALE` ~0.96, `BOUNCE_FACTOR` ~1.4, burst scale/opacity reduced.
- **Dramatic press** (hero CTA / "ship it"): `PRESS_SCALE` ~0.88, `BOUNCE_FACTOR` ~2.5, burst maxed.
- **Color shift during press** — darken mid-press, return on release; interpolated `backgroundColor` at the same timeline positions as the scale tweens. Same state-continuity rule.
- **State change at release** (approve / confirm) — instead of returning to the rest color, swap to `{successColor}` at `RELEASE_START` and pop a checkmark via a separate `back.out(CHECK_BOUNCE)` tween (1.4–2.0, firmer than the button's bounce — a punctuating "stamp"; pop 0.3–0.6 s) at the same position. The button is now terminal — no further presses expected.

## Values

| token                | range                                      | notes                                                                                      |
| -------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| button footprint     | ≥ 3–5% of canvas area                      | a 320×68 button at 1080p is ~1% and the press reads as visually insignificant              |
| PRESS_SCALE          | 0.88 dramatic · 0.92 default · 0.96 subtle | never <0.85 (broken) or >0.98 (no perceptible dip)                                         |
| PRESS_DUR            | 0.10–0.30 s                                | shorter = snappier; must be shorter than `RELEASE_DUR` (input faster than spring recovery) |
| RELEASE_DUR          | 0.40–0.90 s                                | shorter = tight pop; longer = loose, wobbly settle                                         |
| BOUNCE_FACTOR        | 1.4 soft · 2.0 firm · 2.8 cartoony         | or `elastic.out(amplitude, period)` for a rubbery oscillation instead of one overshoot     |
| RELEASE_START        | `= PRESS_START + PRESS_DUR`                | adjacency = automatic state continuity                                                     |
| BURST_PEAK_SCALE     | 3 subtle · 6 default · 8 max               | beyond ~8 the radial gradient pixelates visibly                                            |
| BURST_PEAK_OPACITY   | 0.4–1.0                                    | grow ≈ fade, 0.4–0.7 s each; blur 40–100 px (hard ring → ambient haze)                     |
| BG_GLOW_PEAK_OPACITY | 0.1 subtle · 0.25 default · 0.45 max       | higher washes the whole composition; fade-in 0.6–1.0 s; inset −300…−500 px at 1080p        |

Color tokens: pressed surface darker than rest; rest shadow large + diffuse, pressed small + tight (the button "sinks toward the surface"); burst gradient darker + more saturated than `{btnBg}` — same-color glow looks washed out; bg glow a low-opacity tint of the button's hue family.

## Critical Constraints

- **State continuity** — release start value exactly equals press end value; enforced by same-property adjacency at `RELEASE_START = PRESS_START + PRESS_DUR`.
- **Linear press, spring release** — both spring → squishy; both linear → mechanical, no overshoot punch.
- **Anchor compression on center** (`transform-origin: 50% 50%`) or the button collapses asymmetrically.
- **Burst behind, not in front** — burst `z-index: 1`, button `z-index: 2`; in front it occludes the button at peak opacity.
- **Don't tween `boxShadow` and `filter` on the same element** — they compete in the layout pipeline; shadow on the button, blur on the separate burst layer.
- **Climax dwell** — after the burst peak + reveal, the composition must run ≥ 1 s more (≥ 2 s for dramatic variants); a reveal at `t = DURATION − 0.2 s` reads as "flashed and gone."

## See also

`spring-pop-entrance` (the ENTRANCE counterpart — arrival, not reaction) · `physics-press-reaction` (this press with a visible cursor actor) · `cursor-click-ripple` (the cursor click that triggers the press) · `sine-wave-loop` (idle micro-float BEFORE the press) · `center-outward-expansion` (badge burst synced to the release).

## Selected motion rule: svg-path-draw

---
name: svg-path-draw
description: Animate SVG paths drawing progressively using stroke-dasharray and stroke-dashoffset.
metadata:
  tags: svg, stroke, draw, path, reveal, icon, vector
---

# SVG Path Draw

## Contents

- [Recipe](#recipe)
- [Variations](#variations)
- [Values](#values)
- [Critical Constraints](#critical-constraints)
- [See also](#see-also)

Reveals an SVG shape by animating its stroke as if a pen were tracing it. Two stroke properties together: **`stroke-dasharray = <pathLength>`** makes the entire path one dash; **`stroke-dashoffset`** starts at the path length (dash shifted fully out of view → invisible) and tweens to `0` (fully drawn). The length comes from the DOM API `path.getTotalLength()` — measured, never guessed.

Works on anything with a stroke: `<path>`, `<circle>`, `<rect>`, `<line>`, `<polyline>`, `<polygon>`, `<ellipse>`.

## Recipe

```html
<!-- inside a standard scene clip -->
<svg class="logo-mark" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path id="bar-left" d="M 60 40 L 60 160" />
  <path id="bar-right" d="M 140 40 L 140 160" />
  <path id="bar-mid" d="M 60 100 L 140 100" />
</svg>
```

```css
.logo-mark path {
  fill: none; /* outline-only draw — a fill would appear immediately and ruin the reveal */
  stroke: {accentColor};
  stroke-width: 12;
  stroke-linecap: round; /* softer endpoints */
  stroke-linejoin: round;
}
```

```js
// Setup: measure each path and set its dash pattern. Real measured geometry, not a magic number.
document.querySelectorAll(".logo-mark path").forEach((p) => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = `${len}`;
  p.style.strokeDashoffset = `${len}`;
});

// Stagger draws so the eye reads continuous motion — each segment starts at
// ~70-80% of the previous segment's duration, before it finishes.
tl.to(
  "#bar-left",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_1_START,
);
tl.to(
  "#bar-right",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_2_START,
);
tl.to(
  "#bar-mid",
  { strokeDashoffset: 0, duration: FINAL_SEGMENT_DUR, ease: "power2.out" },
  SEG_3_START,
);

// Companion wordmark fades in only after the last stroke settles.
tl.to(
  ".brand-line",
  { opacity: 1, duration: BRAND_FADE_DUR, ease: "power1.out" },
  BRAND_FADE_START,
);
```

## Variations

- **Ring starting at 12 o'clock** — `<circle>` / `<rect>` strokes start at 3 o'clock by default; rotate the element `-90deg` so a progress ring draws from the top:

```html
<circle
  cx="100"
  cy="100"
  r="60"
  id="ring"
  style="transform-origin: 100px 100px; transform: rotate(-90deg)"
/>
```

- **Linear (constant-speed) draw** — `ease: "none"` for a steady-rate "real pen" trace.
- **Draw then fill** — for filled shapes, tween `fillOpacity: 0 → 1` AFTER the stroke completes (requires `fill-opacity: 0` initially and a real `fill` in CSS):

```js
tl.to(
  "#path",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_1_START,
);
tl.to(
  "#path",
  { fillOpacity: 1, duration: FILL_FADE_DUR, ease: "power1.out" },
  SEG_1_START + SEGMENT_DRAW_DUR,
);
```

## Values

| token             | range                                   | notes                                                                                              |
| ----------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SEGMENT_DRAW_DUR  | 0.3–0.8s                                | fast snap vs deliberate pen trace; >~1s feels sluggish for a logo reveal                           |
| FINAL_SEGMENT_DUR | 60–80% of SEGMENT_DRAW_DUR              | proportional to segment length — a short connector at full duration reads slower than its siblings |
| SEG_N_START       | previous start + 70–80% of its duration | reads as continuous motion, not N isolated animations                                              |
| SEG_1_START       | 0–0.4s                                  | a small ~0.2s lead-in lets the viewer settle before motion                                         |
| BRAND_FADE_START  | ≥ last stroke end (+ ~0.2s beat)        | earlier and the wordmark competes with the draw                                                    |
| BRAND_FADE_DUR    | 0.3–0.8s                                | snap (urgent) vs glide (premium)                                                                   |

Ease families are discrete choices: **stroke draws** use `power2.out` (a hand lifting at end of stroke) or `none` for constant speed — never `back.out` / `elastic.out` (pens don't bounce). **Fades** use `power1.out`.

## Critical Constraints

- **`fill: none`** for outline-only draws — otherwise the fill appears immediately.
- **Dasharray/dashoffset = the measured `getTotalLength()`**, set at setup; requires the SVG in the DOM (inline SVG is fine; a loaded `<image>` SVG is not).
- **Complex paths**: if `getTotalLength()` looks wrong, overestimate slightly (`len * 1.05`) — too large is invisible at animation start; too small clips the end.
- **Stagger multi-path draws at ~70–80%** of the previous segment's duration.
- **A drawn line must land on something.** When the path is a connector (rail, beam, underline, callout) rather than a shape, both endpoints must sit on real elements and the draw must do a job — reveal, route, validate, or emphasize. A stroke that only decorates empty space reads as filler; attach it or cut it.

## See also

`svg-icon-enrichment` (internal parts animate after the outline draws) · `counting-dynamic-scale` (stroke draws an icon while a number counts up) · `hacker-flip-3d` (logo draws, wordmark decodes beneath).
