# osc-basics: OSC 시퀀스 한 줄에서 번호·본문·종결자를 짚고, 터미널이 모르는 번호를 만나면 어떻게 되는지 말한다

Version: 2
Task: `printf '\e]7501;state=done:app=brew\a'` 에서 (1) 번호, 본문, 종결자를 각각 짚어라. (2) 7501을 모르는 터미널에서 이걸 실행하면 화면에 무슨 일이 일어나는가? (3) `\a` 대신 쓸 수 있는 다른 종결자를 하나 대라.
Pass when: (1) 번호 `7501`, 본문 `state=done:app=brew`, 종결자 BEL(`\a`, 0x07) 셋을 정확히 짚는다 (2) 모르는 OSC는 무시되어 화면에 아무것도 나타나지 않고 아무 일도 일어나지 않는다 (3) `ESC \`(`\e\\`) (https://www.superlogical.com/rex/docs/build/program-status — Conventions, Feature detection)
Also accept: (1)에서 `\e]`를 "OSC 시작"으로 함께 짚는 것. (2)에서 "에러 없이 조용히 버려진다"
Aids allowed: none

Version history: v1(`printf '\e]0;hello\a'`를 설명하기)는 레슨 전에 물었으나 학습자가 "처음 본다"고 답해 채점하지 않았다. 레슨이 OSC 0을 다루지 않으므로 7501 시퀀스 기반으로 바꿨다.
