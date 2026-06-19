# React 인증 상태 복원과 HttpOnly RT

사용자는 HttpOnly refresh token 쿠키가 JavaScript에서 읽히지 않는데도 프론트 헤더가 로그인 상태를 어떻게 알 수 있는지 질문했다. 앞으로는 “쿠키를 읽어서 상태를 아는 것”이 아니라 “앱 시작 시 refresh/me API를 호출하고 성공 응답의 user/AT를 React state에 저장하는 것”을 인증 UI의 기준으로 설명한다.
