# Repository Rules / Repository 규칙

이 디렉토리는 데이터 접근 계약과 구현을 담당합니다.

## 규칙

- Feature는 Repository interface에 의존해야 합니다.
- Repository 구현체는 remote client와 DTO를 사용할 수 있습니다.
- Feature에 반환하기 전에 network DTO를 공통 model로 변환합니다.
