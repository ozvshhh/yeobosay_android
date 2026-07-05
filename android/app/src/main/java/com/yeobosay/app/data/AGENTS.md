# Data Layer Rules / 데이터 계층 규칙

이 디렉토리는 서버 통신과 데이터 변환을 담당합니다.

## 수정 가능

- API client
- Socket client
- DTO
- Repository interface와 구현체

## 수정 금지

- Compose UI
- 화면 레이아웃 코드
- Theme 변경

Feature는 raw API client 대신 Repository를 사용해야 합니다.
