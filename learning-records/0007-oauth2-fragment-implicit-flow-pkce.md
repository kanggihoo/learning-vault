# OAuth2 fragment와 implicit flow 구분

사용자는 `#access_token=...` fragment가 왜 언급되는지, 그리고 이것이 현대 authorization code flow와 어떻게 다른지 질문했다. 앞으로 OAuth2를 설명할 때는 fragment를 “서버로 전송되지 않고 프론트 JavaScript만 읽는 URL 조각”으로, implicit flow를 “access token이 authorization response에서 브라우저에 바로 도착하던 예전 흐름”으로 구분해 설명한다.
