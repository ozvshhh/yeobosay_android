# Android Agent Rules / Android 작업 규칙

이 패키지는 YeoboSay Android 클라이언트입니다.

## 기본 규칙

- 요청받은 작업 범위 안에서만 수정합니다.
- 앱 조립과 화면 이동은 `app/`에 둡니다.
- 공통 모델, 설정, 유틸, 디자인 시스템은 `core/`에 둡니다.
- API, DTO, Repository 코드는 `data/`에 둡니다.
- 화면 단위 기능은 `feature/`에 둡니다.
- 마이크, 재생, RMS 감지는 `voice/`에 둡니다.
- UI 코드는 raw API client를 직접 호출하지 않고 Repository를 사용합니다.
- Data 계층 코드는 Compose UI에 의존하지 않습니다.
