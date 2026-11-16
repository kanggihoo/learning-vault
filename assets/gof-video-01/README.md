# GoF 1/6 — Strategy · State · Template Method

레슨 `lessons/0049-gof-strategy-state-template-method.html`을 89초 무음 설명 영상으로 만든 HyperFrames 프로젝트다. 6편 시리즈의 1편이며, 2~6편(레슨 0050~0054)은 이 프로젝트를 틀로 쓴다.

## 파일 지도

위에서 아래로 갈수록 구체적이다. 무언가 바꾸려면 해당 층을 고친다.

| 파일 | 역할 |
|---|---|
| `BRIEF.md` | 왜·누구에게·무엇을. 확정된 요구사항 (메시지, 길이, 비율, 무음) |
| `STORYBOARD.md` | 프레임 7개의 계획. 프레임별 화면 텍스트(`onscreen`)와 시간대별 연출 |
| `frame.md` | 디자인 규칙 (code-editorial 프리셋). 맨 끝 **Project Overrides**에 한글 폰트와 코드 카드 규칙이 있다 |
| `compositions/frames/NN-*.html` | 실제 장면. 프레임 하나가 파일 하나 |
| `index.html` | 7개 장면과 전환을 묶은 최종 타임라인. 스크립트가 생성하므로 직접 고치지 않는다 |
| `assets/fonts/` | 로컬 폰트 (EB Garamond, Inter, JetBrains Mono, Noto Serif/Sans KR) |
| `capture/extracted/visible-text.txt` | 원본 레슨 텍스트. 화면의 코드·표 내용은 모두 여기서 그대로 가져왔다 |

프레임 ID와 구간: `01-look-alike` 0–7.5s · `02-two-signals` 7–18.5s · `03-strategy` 18–33.5s · `04-state` 33–48.5s · `05-template-method` 48–62.5s · `06-compare-table` 62–76.5s · `07-decision-tree` 76–89s

## 미리보기 (Studio)

프로젝트 폴더에서 실행한다.

```bash
cd /Users/kkh/Desktop/learning-vault/assets/gof-video-01

npx hyperframes preview --background   # 백그라운드로 띄우고 주소(http://localhost:XXXX)를 출력
npx hyperframes preview --status       # 실행 중인지 확인
npx hyperframes preview --stop         # 종료
npm run dev                            # 포그라운드 실행 (Ctrl+C로 종료)
```

Studio에서 텍스트를 클릭해 고치거나 타임라인 클립을 끌어 옮기면 파일에 바로 저장된다. 파일을 직접 고쳐도 Studio가 자동으로 새로고침된다.

## 수정 → 검사 → 렌더

```bash
npx hyperframes check                                   # lint + 레이아웃 + 모션 + 명암 대비. "Check passed"가 나와야 한다
npx hyperframes snapshot --at 6,16.5,30,45,60,74,86     # 프레임별 정지 화면 + contact-sheet.jpg (경로는 출력에 나온다)
npx hyperframes render --skill=faceless-explainer --quality high --output renders/video.mp4
```

`check`의 Layout 항목에 나오는 `container_overflow` info 2개(01의 미세 push, 02의 배경 그리드 이동)는 의도한 것이다.

## 프레임을 고친 뒤 다시 묶기

`compositions/frames/`의 파일을 고쳤거나 `STORYBOARD.md`의 길이·전환을 바꿨다면 `index.html`을 다시 만든다.

```bash
SK=../../.claude/skills/faceless-explainer/scripts
node $SK/assemble-index.mjs --storyboard ./STORYBOARD.md --hyperframes .
node $SK/transitions.mjs inject --storyboard ./STORYBOARD.md --hyperframes .
node $SK/transitions.mjs verify --storyboard ./STORYBOARD.md --index ./index.html
npx hyperframes check
```

프레임을 처음부터 다시 만들 때는 먼저 작업 패킷을 다시 생성하고(`node $SK/frame-packets.mjs --project "$PWD" --storyboard "$PWD/STORYBOARD.md"`), `.hyperframes/frame-packets/_role.md`와 `NN-*.md`를 AI 에이전트에게 넘긴다.

## 다음 편(2~6편) 만들기

AI 에이전트에게 `/hyperframes`로 "GoF 2편을 1편과 같은 브리프·디자인으로" 요청한다. 그러면 새 폴더(`assets/gof-video-02/` 등)에서 다음을 재사용한다.

- `BRIEF.md`: 메시지와 원본 레슨만 바꾼다
- `frame.md`, `assets/fonts/`: 그대로 복사한다
- `STORYBOARD.md`의 `## Video direction`: 공통 무대 규칙이므로 그대로 둔다

## 주의할 점 (설정 파일에 드러나지 않는 것)

- **한글 폰트는 일부 글자만 들어 있다.** Noto KR 파일은 KS X 1001 상용 한글 2,350자, ASCII, 일부 기호(→ ① ② ✱ ·)로 줄인 것이다. 이 범위 밖의 드문 글자(예: 똠, 햏)는 렌더에서 다른 폰트로 대체된다. 새 글자가 필요하면 Google Fonts의 `NotoSansKR[wght].ttf`를 받아 `pyftsubset`으로 다시 만든다. 변수 폰트를 굵기별로 고정하는 instancer는 매우 느리니 피한다.
- **코랄 글자는 `#A5614A`를 쓴다.** 프리셋 코랄 `#CC785C`는 크림 배경에서 명암 대비가 부족하다. 남색 코드 카드 안의 코랄은 원래 색을 그대로 쓴다.
- **한 프레임 안에서 시간이 겹치는 클립은 서로 다른 `data-track-index`를 쓴다.** 같은 트랙에서 겹치면 `assemble-index.mjs`가 거부한다.
- **id와 class는 숫자로 시작하지 않는다.** CSS 선택자가 깨지기 때문에 `s03-`, `st04-`, `tm05-`, `f06-`, `f07-` 같은 접두사를 쓴다.
- **프레임 패킷은 48KB를 넘을 수 없다.** 큰 blueprint(예: `kinetic-type-beats`, 29KB)를 지정하면 패킷 생성이 실패한다. 이 경우 `blueprint: compose`로 바꾸고 연출을 직접 적는다.
- **무음 영상이다.** `STORYBOARD.md`의 `music: none`과 `SCRIPT.md` 없음이 함께 무음을 뜻한다. 내레이션을 추가하려면 한국어 TTS가 필요하다. 내장 Kokoro는 한국어를 지원하지 않으므로 HeyGen 로그인(`npx hyperframes auth login`)이 필요하다.
