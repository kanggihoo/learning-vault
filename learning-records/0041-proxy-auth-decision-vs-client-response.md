# Forward Auth 판정과 앱의 최종 응답

Concept: proxy-forward-auth-decision, unassessed → needs-repair
Date: 2026-11-21

Traefik의 302를 받은 브라우저가 거부 페이지로 이동한다는 점을 설명했다. Nginx 기본 동작과 별도 redirect 설정을 섞었고, 인증 서비스의 2xx를 앱으로 요청을 보내는 신호 대신 브라우저로 반환하는 응답으로 해석했다.

Evidence: checks/proxy-forward-auth-decision.md v1. Traefik에서 302를 받아 이동한다고 답했다. Nginx에서는 JSON 값을 이용한 라우팅을 추가한다고 했으며 기본 동작에서 앱에 도달하는지는 답하지 않았다. 2xx는 브라우저에 그대로 반환한다고 답했다. aids: 별도 도구 사용 언급 없음. judged: gap. Nginx 기본 302 처리와 두 프록시의 204 허용 동작을 확인하지 못했다.
