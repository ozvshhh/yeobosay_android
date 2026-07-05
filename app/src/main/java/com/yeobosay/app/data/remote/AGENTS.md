# Remote Data Rules / 원격 통신 규칙

이 디렉토리는 HTTP와 Socket.IO client를 담당합니다.

## 규칙

- raw network call은 이곳에 둡니다.
- DTO 또는 low-level network result를 반환합니다.
- 이 계층에서 UI state를 노출하지 않습니다.
