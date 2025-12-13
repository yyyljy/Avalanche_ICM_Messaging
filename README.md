# 🎄 Avalanche ICM 메시지 전송 프로젝트

Avalanche Interchain Message (ICM)를 사용하여 체인 간 메시지를 전송하는 프로젝트입니다. 웹 애플리케이션과 CLI 도구를 모두 제공합니다.

## 📋 목차

- [사전 준비](#사전-준비)
- [설치 및 실행](#설치-및-실행)
  - [방법 1: 웹 애플리케이션 (icm-web)](#방법-1-웹-애플리케이션-icm-web)
  - [방법 2: CLI 스크립트 (icm-sdk)](#방법-2-cli-스크립트-icm-sdk)
- [사용 방법](#사용-방법)
- [문제 해결](#문제-해결)
- [프로젝트 구조](#프로젝트-구조)
- [기술 스택](#기술-스택)

## 🔧 사전 준비

### 1. Core Wallet 설치 (웹 애플리케이션용)

1. **Chrome/Brave 브라우저에서 Core Wallet 설치**
   - [Core Wallet 다운로드](https://core.app/) 페이지 방문
   - "Download Extension" 버튼 클릭
   - 브라우저 확장 프로그램 설치

2. **지갑 생성 또는 복구**
   - 새 지갑 생성: "Create a New Wallet" 선택
   - 기존 지갑 복구: "Import Wallet" 선택 후 시드 구문 입력
   - 비밀번호 설정 및 시드 구문 안전하게 보관

3. **Fuji 테스트넷으로 전환**
   - Core Wallet 확장 프로그램 열기
   - 네트워크 드롭다운 클릭 (상단)
   - "Fuji Testnet" 선택

4. **테스트 AVAX 받기**
   - [Avalanche Faucet](https://faucet.avax.network/) 방문
   - 지갑 주소 입력 (Core Wallet에서 복사)
   - "Request AVAX" 버튼 클릭
   - 몇 초 후 지갑에 테스트 AVAX가 입금됩니다

## 🚀 설치 및 실행

이 프로젝트는 두 가지 방법으로 ICM 메시지를 전송할 수 있습니다:
- **icm-web**: 브라우저에서 Core Wallet을 사용하는 웹 애플리케이션
- **icm-sdk**: Node.js 환경에서 개인키를 사용하는 CLI 도구

원하는 방법을 선택하여 아래 가이드를 따라주세요.

---

## 방법 1: 웹 애플리케이션 (icm-web) 🌐

브라우저에서 Core Wallet을 연결하여 ICM 메시지를 전송합니다.

### 1단계: 프로젝트 디렉토리로 이동

```bash
cd Avalanche_ICM_Messaging/icm-web
```

### 2단계: 의존성 설치

```bash
npm install
```

### 3단계: 개발 서버 실행

```bash
npm run dev
```

서버가 시작되면 브라우저에서 **http://localhost:5173** 을 엽니다.

### 4단계: 웹 애플리케이션 사용

#### 4-1. Core Wallet 연결
- 웹 페이지에서 **"Core Wallet 연결"** 버튼 클릭
- Core Wallet 팝업이 나타나면 **"연결"** 승인
- 연결되면 지갑 주소가 화면에 표시됩니다

#### 4-2. 메시지 전송
- 텍스트 입력란에 원하는 메시지 입력 (예: "Hello from Avalanche Fuji!")
- **"메시지 전송"** 버튼 클릭
- Core Wallet 팝업에서 트랜잭션 확인 및 승인

#### 4-3. 결과 확인
- 트랜잭션 해시가 표시됩니다
- Explorer 링크를 클릭하여 상세 정보 확인

---

## 방법 2: CLI 스크립트 (icm-sdk) 💻

Node.js 환경에서 개인키를 사용하여 직접 ICM 메시지를 전송합니다.

**📌 사전 요구사항**: icm-web에서 Avalanche SDK를 먼저 빌드해야 합니다 (icm-sdk가 icm-web의 node_modules를 참조).

### 1단계: 프로젝트 디렉토리로 이동

```bash
cd Avalanche_ICM_Messaging/icm-sdk
```

### 2단계: 의존성 설치

```bash
npm install
```

### 3단계: 개인키 설정

터미널에서 환경 변수로 개인키를 설정합니다:

```bash
# Linux/Mac
export PRIVATE_KEY=0x여기에개인키입력

# Windows (PowerShell)
$env:PRIVATE_KEY="0x여기에개인키입력"

# Windows (CMD)
set PRIVATE_KEY=0x여기에개인키입력
```

**⚠️ 보안 주의사항**: 
- 개인키는 **테스트넷 전용 지갑**의 것을 사용하세요
- 절대 **메인넷 자산이 있는 지갑**의 개인키를 사용하지 마세요
- 개인키를 코드나 파일에 직접 작성하지 마세요

### 4단계: 메시지 전송

```bash
npm run send-message
```

**실행 결과 예시:**

```bash
계정 주소: 0x...
Wallet Client 생성 완료
ICM Client 초기화 완료
소스 체인: Avalanche Fuji
목적지 체인: T1K Testnet
메시지 전송 중: "L1으로 보내보는 메세지"
✅ 메시지 전송 성공!
트랜잭션 해시: 0x...
```

### 4단계: (선택사항) 메시지 내용 수정

`send-icm-message.ts` 파일을 편집하여 메시지 내용이나 목적지 체인을 변경할 수 있습니다:

```typescript
// 76번 줄 근처
const message = "여기에 원하는 메시지를 입력하세요";
```

---

## 📖 사용 방법 비교

| 특성 | icm-web (웹) | icm-sdk (CLI) |
|------|--------------|---------------|
| **환경** | 브라우저 | Node.js 터미널 |
| **지갑** | Core Wallet 확장 프로그램 | 개인키 직접 입력 |
| **UI** | 그래픽 인터페이스 | 명령줄 |
| **편의성** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **자동화** | ❌ | ✅ (스크립트 가능) |
| **권장 용도** | 일반 사용자 | 개발자/테스트 |

## 🐛 문제 해결

### Core Wallet이 감지되지 않는 경우

- Core Wallet 확장 프로그램이 설치되어 있는지 확인
- 페이지를 새로고침
- 브라우저를 다시 시작

### 네트워크 오류

- Core Wallet이 **Fuji Testnet**으로 설정되어 있는지 확인
- 지갑에 충분한 테스트 AVAX가 있는지 확인 (최소 0.5 AVAX 권장)

### "PRIVATE_KEY 환경 변수를 설정해주세요" 오류

icm-sdk 사용 시 환경 변수가 제대로 설정되지 않았습니다:

```bash
export PRIVATE_KEY=0x여기에개인키입력
npm run send-message
```

## 📂 프로젝트 구조

```
Avalanche_ICM_Messaging/
├── icm-web/                          # 웹 애플리케이션
│   ├── src/
│   │   ├── components/
│   │   │   └── ChristmasMessageForm.tsx  # 메시지 전송 폼
│   │   ├── contexts/
│   │   │   └── WalletContext.tsx         # 지갑 상태 관리
│   │   ├── hooks/
│   │   │   └── useWallet.ts              # 지갑 연결 Hook
│   │   ├── utils/
│   │   │   └── icm.ts                    # ICM 메시지 전송 로직
│   │   ├── types/
│   │   │   └── window.d.ts               # TypeScript 타입 정의
│   │   ├── App.tsx                       # 메인 앱
│   │   └── main.tsx                      # 진입점
│   ├── vite.config.ts                    # Vite 설정
│   └── package.json
├── icm-sdk/                          # CLI 스크립트
│   ├── send-icm-message.ts               # ICM 메시지 전송 스크립트
│   ├── tsconfig.json                     # TypeScript 설정
│   └── package.json
└── README.md                             # 이 파일
```

## 🛠️ 기술 스택

### icm-web (웹 애플리케이션)
- **Web3**: 
  - `@avalanche-sdk/interchain` - ICM 메시지 전송
  - `@avalanche-sdk/client` - Avalanche 클라이언트
  - `viem` - Ethereum 상호작용

### icm-sdk (CLI 도구)
- **Runtime**: Node.js + TypeScript
- **Execution**: tsx / ts-node
- **Web3**:
  - `@avalanche-sdk/interchain` - ICM 메시지 전송
  - `@avalanche-sdk/client` - Avalanche 클라이언트

## 🌐 체인 정보

- **소스 체인**: Avalanche Fuji Testnet
  - Chain ID: 43113
  - RPC: https://api.avax-test.network/ext/bc/C/rpc
  
- **목적지 체인**: T1K Testnet (Avalanche L1)
  - Chain ID: 54585
  - RPC: https://subnets.avax.network/t1k/testnet/rpc

## ⚠️ 주의사항

- ⚠️ **테스트넷 전용**: 실제 자산을 사용하지 마세요
- 🔐 **개인키 보안**: 시드 구문과 개인키를 절대 공유하지 마세요
- 💰 **가스비**: 각 메시지 전송 시 소량의 AVAX가 소비됩니다
- 🌐 **네트워크 확인**: 항상 Fuji Testnet에 연결되어 있는지 확인하세요

## 🔗 유용한 링크

- [Avalanche Documentation](https://docs.avax.network/)
- [Core Wallet](https://core.app/)
- [Avalanche Faucet](https://faucet.avax.network/)
- [Fuji C-Chain Explorer](https://subnets-test.avax.network/c-chain)
- [T1K Testnet Explorer](https://subnets.avax.network/t1k)
- [Avalanche SDK](https://github.com/ava-labs/avalanche-sdk-typescript)

## 💡 추가 정보

### ICM (Interchain Messaging)이란?

Avalanche의 ICM은 서로 다른 블록체인 간에 안전하게 메시지를 전송할 수 있는 프로토콜입니다. 이 프로젝트에서는 Avalanche Fuji C-Chain에서 T1K L1으로 메시지를 전송합니다.

### 메시지 전송 흐름

1. 사용자가 메시지 입력 및 전송 요청
2. 지갑에서 트랜잭션 서명 (Core Wallet 또는 개인키)
3. Fuji C-Chain에 트랜잭션 제출
4. Teleporter 컨트랙트가 메시지를 목적지 체인으로 전달
5. 트랜잭션 해시 및 메시지 ID 반환

## 📝 라이선스

MIT License

---

Made with ❤️ by Team 1 Korea
