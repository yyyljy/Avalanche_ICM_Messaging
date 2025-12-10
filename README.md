# ICM 메시지 전송 예제

Avalanche Interchain Message (ICM)를 사용하여 체인 간 메시지를 전송하는 예제 프로젝트입니다.

## 설치

```bash
npm install
```

## 사용 방법

### 1. 환경 변수 설정

개인키를 환경 변수로 설정하거나 `send-icm-message.ts` 파일에서 직접 설정할 수 있습니다.

```bash
export PRIVATE_KEY=0x...
```

### 2. 메시지 전송

```bash
npm run send-message
```

또는

```bash
ts-node send-icm-message.ts
```

## 코드 구조

- `send-icm-message.ts`: ICM 메시지 전송 예제 코드
- `CODE.md`: Avalanche SDK 사용 가이드
- `package.json`: 프로젝트 의존성 및 스크립트

## 주요 기능

1. **Wallet Client 생성**: 개인키를 사용하여 Avalanche 지갑 클라이언트 생성
2. **ICM Client 초기화**: Interchain Message 클라이언트 초기화
3. **메시지 전송**: Avalanche Fuji에서 Dispatch 체인으로 메시지 전송

## 참고사항

- 현재 예제는 Avalanche Fuji 테스트넷을 사용합니다
- 실제 개인키를 사용하기 전에 테스트넷에서 먼저 테스트하세요
- 개인키는 절대 공개 저장소에 커밋하지 마세요

