# Call Feature Rules / 통화 기능 규칙

이 feature는 실제 통화 경험을 담당합니다.

## 수정 가능

- 수신 전화 UI
- 통화중 UI
- 통화 종료 요약 UI
- Call ViewModel
- 통화 전용 UI state

## 규칙

- API 작업은 Repository를 통해 처리합니다.
- 서버 없이 동작하는 preview 로직은 가능한 `call_preview`에 둡니다.
