# YeoboSay 통합 레포지토리

YeoboSay는 어르신을 위한 AI 음성 통화 서비스입니다.
전화 통화와 유사한 AI 대화, 정서적 말벗, 음성 인터랙션, 큰 글자 중심의 접근성을 목표로 합니다.

이 레포지토리는 앞으로 **통합 관리, 문서, API 계약, 배포 설정**을 담당합니다.
Android 앱과 백엔드 기능 개발은 아래의 전용 레포지토리에서 진행합니다.

## 레포지토리 구성

| 영역 | 레포지토리 | 역할 |
| --- | --- | --- |
| Android | https://github.com/ozvshhh/yeobosay_android | Android 앱 개발 |
| Backend | https://github.com/ozvshhh/yeobosay_backend | NestJS 백엔드 서버 개발 |
| Integration | https://github.com/ozvshhh/YeoboSay | 문서, API 계약, 배포, 통합 테스트 관리 |

## 이 레포지토리의 역할

이 레포지토리는 다음 용도로 사용합니다.

- 제품/기술 문서 관리
- API 계약 및 공통 명세 관리
- 통합 테스트와 배포 계획 관리
- 데모 및 개발 환경 실행 가이드 관리
- Android/Backend 레포지토리 간 작업 조율

새로운 Android 기능 개발이나 백엔드 기능 개발은 이 레포지토리가 아니라 전용 레포지토리에서 진행합니다.

## 디렉토리 안내

```text
YeoboSay/
  contract/   API 계약과 공통 명세
  docs/       제품, 디자인, 아키텍처, 개발 계획 문서
  android/    기존 모노레포에서 분리되기 전 Android 스냅샷
  backend/    기존 모노레포에서 분리되기 전 Backend 스냅샷
```

`android/`와 `backend/` 디렉토리는 레포지토리 분리 과정에서 남겨둔 기존 스냅샷입니다.
신규 개발은 각각 `yeobosay_android`, `yeobosay_backend` 레포지토리에서 진행합니다.

## 로컬 개발 환경

### Android

Android 앱은 전용 레포지토리를 내려받아 작업합니다.

```bash
cd /Users/dlgkdms4660/DEV
git clone https://github.com/ozvshhh/yeobosay_android.git
```

Android Studio에서 `yeobosay_android` 디렉토리를 열고 Gradle Sync 후 실행합니다.

Android Emulator에서 로컬 백엔드 서버에 접근할 때는 아래 주소를 사용합니다.

```text
http://10.0.2.2:3000
```

실제 Android 기기로 테스트할 때는 `10.0.2.2`를 사용할 수 없습니다.
다음 중 하나를 사용합니다.

- 배포된 HTTPS 백엔드 주소
- 같은 Wi-Fi에 연결된 PC의 로컬 IP
- ngrok 같은 임시 터널링 주소

### Backend

백엔드는 전용 레포지토리를 내려받아 작업합니다.

```bash
cd /Users/dlgkdms4660/DEV
git clone https://github.com/ozvshhh/yeobosay_backend.git
cd yeobosay_backend
npm install
cp .env.example .env
```

`.env`에 필요한 환경변수를 설정합니다.
특히 OpenAI API Key가 필요합니다.

```env
OPENAI_API_KEY=your_openai_api_key
```

로컬 DB와 백엔드를 실행합니다.

```bash
docker compose up -d
npx prisma migrate dev
npm run start
```

서버가 정상 실행되었는지 확인합니다.

```bash
curl http://localhost:3000/health
```

## 데모 시연 체크리스트

1. Docker Desktop을 실행합니다.
2. `yeobosay_backend` 레포지토리에서 백엔드를 실행합니다.
3. `GET /health` 응답이 정상인지 확인합니다.
4. Android Studio에서 `yeobosay_android`를 엽니다.
5. Android 앱의 API 주소가 현재 백엔드 환경을 바라보는지 확인합니다.
6. Emulator 또는 실제 Android 기기에서 앱을 실행합니다.
7. 앱에서 테스트 전화 요청 버튼을 누릅니다.
8. 전화 수신 화면, 통화 화면, AI 음성 응답, 녹음 흐름, 통화 요약 화면을 확인합니다.

## 자주 발생하는 문제

### Docker Desktop이 꺼져 있는 경우

```text
Cannot connect to the Docker daemon
```

Docker Desktop을 먼저 실행해야 합니다.

### PostgreSQL 5432 포트가 이미 사용 중인 경우

```text
Bind for 0.0.0.0:5432 failed: port is already allocated
```

다른 PostgreSQL 컨테이너가 이미 `5432` 포트를 사용 중인 상태입니다.
기존 컨테이너를 종료하거나, 이미 실행 중인 DB를 그대로 사용하면 됩니다.

### Prisma가 DB에 연결하지 못하는 경우

```text
P1001: Can't reach database server at localhost:5432
```

백엔드 DB 컨테이너를 실행합니다.

```bash
docker compose up -d
```

### 백엔드 3000번 포트가 이미 사용 중인 경우

```text
listen EADDRINUSE: address already in use :::3000
```

다른 백엔드 프로세스가 이미 `3000` 포트를 사용 중입니다.
기존 프로세스를 종료하거나 백엔드 포트를 변경해야 합니다.

### Android 앱이 백엔드에 연결하지 못하는 경우

- Emulator: `http://10.0.2.2:3000` 사용
- 실제 기기: PC 로컬 네트워크 IP 또는 배포/터널링된 백엔드 URL 사용
- Android 앱에서 마이크 권한이 허용되어 있는지 확인

## API 계약 관리

API 변경은 `contract/`와 백엔드 Swagger 문서를 기준으로 조율합니다.

권장 흐름은 다음과 같습니다.

1. API 계약 또는 관련 문서를 먼저 수정합니다.
2. `yeobosay_backend`에서 백엔드 API를 구현합니다.
3. `yeobosay_android`에서 Android 클라이언트 호출부를 반영합니다.
4. 현재 백엔드와 Android 앱을 연결해 통합 테스트를 진행합니다.

## 참고

이 레포지토리는 레포지토리 분리 작업이 완료될 때까지 기존 모노레포 소스 트리를 일부 포함할 수 있습니다.
실제 구현 작업의 기준은 Android 전용 레포지토리와 Backend 전용 레포지토리로 봅니다.
