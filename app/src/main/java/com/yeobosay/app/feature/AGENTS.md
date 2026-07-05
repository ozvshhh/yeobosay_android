# Feature Layer Rules / 기능 계층 규칙

이 디렉토리는 화면 단위 제품 기능을 담당합니다.

## 규칙

- 각 feature는 Screen, ViewModel, UiState, feature 전용 component를 가질 수 있습니다.
- Feature는 raw API client가 아니라 Repository를 호출해야 합니다.
- 특정 feature 전용 컴포넌트는 해당 feature 디렉토리 안에 둡니다.
