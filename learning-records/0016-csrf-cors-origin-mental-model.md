# CSRF와 CORS/Origin 검증 멘탈 모델

사용자는 CSRF 최종 정리 과정에서 “CORS는 허용되지 않은 origin의 응답 읽기를 막을 수 있지만, simple request가 서버에 도착해 상태 변경을 일으키는 것까지 항상 막지는 않는다”는 점을 명확히 구분했다. 이후 웹 보안 Teach Session에서는 CORS를 CSRF 방어 자체가 아니라 브라우저 응답 읽기/custom header 허용 정책으로 설명하고, 상태 변경 API는 서버 처리 전에 CSRF 토큰과 Origin/Referer 검증을 함께 보는 모델을 기준으로 삼는다.
