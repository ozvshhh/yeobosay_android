# YeoboSay Android

YeoboSay Android는 음성 기반 통화 흐름을 실험하고 구현하기 위한 Android 앱입니다. 사용자의 음성을 녹음해 서버로 전송하고, 서버 응답을 받아 대화형 통화 경험을 구성하는 것을 중심으로 합니다.

## 주요 기능

- 통화 세션 생성 및 종료
- 수동 녹음 기반 음성 턴 업로드
- 자동 대화 흐름 처리
- 서버 응답 음성 재생
- 통화 초대 생성, 수락, 거절
- 통화 상태 전이를 관리하는 상태 머신
- 음성 RMS 기반 말소리 감지

## 기술 스택

- Kotlin
- Android
- Jetpack Compose
- Material3
- Kotlin Coroutines
- Socket.IO Client
- JUnit / AndroidX Test

## 실행 환경

- minSdk: 26
- targetSdk: 36
- compileSdk: 36.1
- Java 11
- Gradle Wrapper 사용

Android Studio에서 프로젝트를 열고 `app` 모듈을 실행하면 됩니다.

## 실행 방법

디버그 빌드:

```bash
./gradlew assembleDebug
```

단위 테스트:

```bash
./gradlew test
```

Android 계측 테스트:

```bash
./gradlew connectedAndroidTest
```

## 백엔드/API 연결

현재 앱의 기본 API 주소는 에뮬레이터에서 로컬 서버를 바라보는 값으로 설정되어 있습니다.

```text
http://10.0.2.2:3000
```

Android 에뮬레이터에서 `10.0.2.2`는 개발 머신의 `localhost`를 의미합니다. 따라서 로컬 백엔드 서버가 `3000` 포트에서 실행 중이어야 앱이 정상적으로 API에 접근할 수 있습니다.

실제 Android 기기에서 테스트하는 경우에는 `10.0.2.2`를 사용할 수 없으므로, 같은 네트워크에서 접근 가능한 개발 머신의 IP 주소로 API base URL을 변경해야 합니다.

## 디렉토리 구조

```text
.
├── app/                         # Android 앱 모듈
│   ├── build.gradle.kts          # app 모듈 Gradle 설정
│   ├── proguard-rules.pro        # 릴리즈 빌드 ProGuard 설정
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml
│       │   ├── java/com/yeobosay/app/
│       │   │   ├── MainActivity.kt
│       │   │   ├── app/          # DI, navigation 등 앱 공통 구성
│       │   │   ├── core/         # 설정, 모델, 유틸, 디자인 시스템
│       │   │   ├── data/         # API, DTO, repository, socket
│       │   │   ├── feature/      # 기능 단위 화면 구성
│       │   │   ├── ui/           # 테마 및 통화 UI
│       │   │   └── voice/        # 녹음, 재생, 음성 감지
│       │   └── res/              # 리소스, 폰트, 테마, 런처 아이콘
│       ├── test/                 # JVM 단위 테스트
│       └── androidTest/          # Android 계측 테스트
├── gradle/
│   ├── libs.versions.toml        # 의존성 및 플러그인 버전 카탈로그
│   └── wrapper/                  # Gradle Wrapper 설정
├── build.gradle.kts              # 루트 Gradle 설정
├── settings.gradle.kts           # 프로젝트 및 모듈 설정
├── gradle.properties
├── gradlew
└── gradlew.bat
```

## 주요 패키지

| 패키지 | 설명 |
| --- | --- |
| `app` | 앱 전역 구성, DI, navigation |
| `core` | 공통 설정, 모델, 유틸, 디자인 시스템 |
| `data` | 서버 API, DTO, repository, 통화 초대 socket |
| `feature` | 기능 단위 화면 및 컴포넌트 |
| `ui` | Compose 테마와 통화 화면/ViewModel/상태 머신 |
| `voice` | 오디오 녹음, 재생, 음성 레벨 감지 |

## 통화 처리 흐름

1. 앱에서 통화 세션을 생성합니다.
2. 사용자의 음성을 녹음합니다.
3. 녹음 파일을 서버에 업로드합니다.
4. 서버가 사용자 발화 텍스트, 응답 텍스트, 응답 음성을 반환합니다.
5. 앱이 응답 음성을 재생하고 다음 턴을 준비합니다.
6. 종료 조건에 도달하면 통화 세션을 종료합니다.

## 테스트

현재 포함된 주요 단위 테스트는 다음과 같습니다.

- `AudioLevelMathTest`: 음성 레벨 계산 관련 테스트
- `CallStateMachineTest`: 통화 상태 전이 테스트

전체 단위 테스트는 아래 명령어로 실행합니다.

```bash
./gradlew test
```

## 개발 메모

- 앱은 `INTERNET`, `RECORD_AUDIO` 권한을 사용합니다.
- 개발 편의를 위해 cleartext HTTP 트래픽이 허용되어 있습니다.
- 로컬 API 주소는 현재 코드에 직접 정의되어 있으므로, 배포 전에는 빌드 설정이나 환경별 설정으로 분리하는 것이 좋습니다.
- 릴리즈 빌드에서는 API URL, 권한 안내 UX, ProGuard/minify 설정을 다시 확인해야 합니다.

## 향후 개선 사항

- API base URL을 `BuildConfig` 또는 Gradle property로 분리
- 실제 기기 테스트 가이드 추가
- CI에서 빌드 및 테스트 자동화
- 주요 화면 스크린샷 또는 데모 GIF 추가
- 서버 API 명세 문서 연결
