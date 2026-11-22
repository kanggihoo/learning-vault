# 한 번 로그인하면 어느 앱까지 열릴까
Lang: ko
Target: 두 앱에서 cookie 수신 범위를 그려 앱·중앙 로그아웃 뒤 재방문을 예측한다.

:::recap
[0058](./0058-proxy-forward-auth-trust.html)에서는 브라우저가 reports 호스트에 보낸 cookie를 Traefik이 인증 서비스에도 전달했다. 브라우저에 cookie가 있어도 그 호스트에 전송되는지는 cookie 범위를 봐야 한다.
:::

:::key
두 앱에서 로그인 화면을 한 번만 보는 경험은 두 가지 구조로 만들 수 있다. 하나는 동일한 cookie를 여러 호스트에 보내는 방식이고, 다른 하나는 중앙 로그인에서 기존 세션을 사용하고 각 앱에 별도 세션을 만드는 방식이다.
:::

:::compare
### 상위 도메인 cookie 공유

`auth.example.com`에서 중앙 인증 cookie를 `Domain=example.com`, `Path=/`로 설정한다. 다른 조건이 충족되면 브라우저는 `reports.example.com`과 `dash.example.com`을 열 때 같은 cookie를 보낼 수 있다. 두 앱에 앞선 proxy가 그 값을 같은 인증 서비스의 판정에 사용한다는 예시다. [RFC 6265 §4.1.2.3, §5.4](https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2.3) · [Cookie 전송](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.4)

### 중앙 host-only cookie와 앱별 세션

중앙 OP가 `Domain`을 생략하면 중앙 cookie는 `auth.example.com`에만 전송된다. reports와 dash는 각각 RP이며 자기 호스트의 앱 세션을 가진다고 가정한다. 처음 dash를 열면 브라우저가 중앙 OP로 이동한다. OP가 기존 세션을 확인하고 추가 인증 없이 진행하면 dash는 callback을 처리해 자기 세션을 만든다. [RFC 6265 §5.3–5.4](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.3) · [OIDC Core §3.1.2.3–5](https://openid.net/specs/openid-connect-core-1_0.html#Authenticates)
:::

:::iframe
[중앙 cookie를 써서 두 번째 앱의 세션을 만드는 흐름](../figures/0059-central-sso-visit.html)
OP cookie를 싣는 화살표와 dash의 세션이 생기는 화살표를 각각 찾자. 추가 동의나 재인증을 요구하지 않는 예측이다.
mode: archify
height: 700px
:::

| `auth.example.com`이 설정한 cookie | auth.example.com | reports.example.com | dash.example.com |
|---|---|---|---|
| `Domain=example.com` | 전송 | 전송 | 전송 |
| `Domain` 생략 | 전송 | — | — |

HTTPS와 `Path=/` 등 나머지 저장·전송 조건을 충족한다고 가정한다. 삭제용 `Set-Cookie`도 지울 cookie와 이름·domain·path가 맞아야 한다. [RFC 6265 §4.1.2, §5.3–5.4](https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2) · [저장과 전송](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.3)

## 로그아웃 후 어떤 세션이 남을까

각 앱이 독립 세션을 유지하고 로그아웃을 전파하지 않는 두 번째 구성이다. 두 앱을 한 번씩 열어 두 앱과 중앙의 세션이 모두 유효한 상태에서 각 행을 따로 시작한다. 아래는 이 전제로 도출한 예측이다. [OIDC Core 인증 단계](https://openid.net/specs/openid-connect-core-1_0.html#Authenticates) · [OIDC RP-Initiated Logout §2](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout)

| 종료한 세션 | reports 재방문 | dash 재방문 |
|---|---|---|
| reports의 앱 세션만 | 중앙에 갔다가 기존 OP 세션으로 새 reports 세션을 만들 수 있음 | 기존 dash 세션 사용 |
| 중앙 OP의 세션만 | 기존 reports 세션 사용 | 기존 dash 세션 사용 |
| reports 앱 세션과 중앙 OP 세션 | reports에서 다시 인증을 요청 | 기존 dash 세션 사용 |

:::quiz
공유 cookie가 유효하고 두 앱이 모두 그 cookie로 매 요청 판정을 받는다. 브라우저에서 해당 공유 cookie를 지우면 다음 두 보호 요청은?
- [ ] reports만 중앙 인증 cookie 없이 요청한다
  Feedback: 두 호스트에서 같은 공유 cookie를 사용했다. 이 브라우저에서 같은 저장 항목을 삭제하면 두 호스트 모두 그 값을 보내지 않는다.
- [ ] 두 앱 모두 중앙 인증 cookie를 계속 보낸다
  Feedback: DB에 세션이 남아 있어도 이 브라우저는 삭제한 cookie를 실을 수 없다.
- [x] 두 앱 모두 중앙 인증 cookie 없이 요청한다
  Feedback: 한 저장 항목이 두 앱에 전송되던 구성이다. 이 관찰로 확인하는 범위는 브라우저의 cookie 상태까지다.
:::

:::terms
- Host-only cookie: Domain 속성을 생략해서 설정한 호스트에만 전송되는 cookie.
- OP: OpenID Provider. 중앙에서 사용자를 인증하고 OIDC 인증 결과를 발급하는 서비스.
- RP: Relying Party. OP의 인증 결과를 검증하고 자기 서비스에서 사용하는 앱 또는 백엔드.
:::

두 호스트의 요청과 재방문 결과를 표로 예측했다. 실제 브라우저 수신·저장은 미확인이다. [Proxy 단 인증 빠른 참조](../reference/0026-proxy-auth-quick-reference.html)

:::source
[RFC 6265 §5.4](https://www.rfc-editor.org/rfc/rfc6265.html#section-5.4)에서 host-only 조건과 Domain 매칭 조건을 두 호스트에 적용해 보자.
:::

:::ask
Teach Session에서 reports 앱이 먼저 로그아웃한 뒤 일정 시간이 지나 OP 세션도 만료되는 경우를 순서대로 따라가 보자.
:::
