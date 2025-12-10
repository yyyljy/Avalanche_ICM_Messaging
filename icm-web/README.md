# 🔗 Avalanche ICM Messenger

Core Wallet을 연결하고 Avalanche Interchain Message (ICM)를 전송할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🦊 **Core Wallet 연결**: 브라우저 확장 프로그램을 통한 간편한 지갑 연결
- 📨 **ICM 메시지 전송**: Avalanche Fuji 테스트넷에서 Dispatch 체인으로 메시지 전송
- 🎨 **현대적인 UI**: 반응형 디자인과 아름다운 그라디언트
- ⚡ **실시간 피드백**: 트랜잭션 상태 및 오류 메시지 표시

## 🚀 시작하기

### 사전 요구사항

1. **Core Wallet 설치**: [https://core.app/](https://core.app/)에서 브라우저 확장 프로그램 설치
2. **테스트넷 토큰**: Avalanche Fuji 테스트넷 AVAX 필요 (Faucet에서 받기 가능)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어주세요.

## 📖 사용 방법

1. **Core Wallet 연결**
   - "Core Wallet 연결" 버튼 클릭
   - Core Wallet에서 연결 승인

2. **메시지 전송**
   - 메시지 입력란에 전송할 내용 입력
   - "메시지 전송" 버튼 클릭
   - Core Wallet에서 트랜잭션 승인

3. **결과 확인**
   - 트랜잭션 해시 확인
   - Explorer 링크를 통해 상세 정보 확인

## 🛠️ 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Web3**: Avalanche SDK (Interchain & Client)
- **Styling**: CSS3 (Gradient & Modern UI)

## 📂 프로젝트 구조

```
src/
├── components/
│   ├── WalletConnect.tsx    # 지갑 연결 컴포넌트
│   └── MessageForm.tsx       # 메시지 전송 폼
├── hooks/
│   └── useWallet.ts          # 지갑 연결 관리 Hook
├── utils/
│   └── icm.ts                # ICM 메시지 전송 유틸리티
├── types/
│   └── window.d.ts           # TypeScript 타입 정의
├── App.tsx                   # 메인 앱 컴포넌트
└── App.css                   # 스타일
```

## 🌐 체인 정보

- **소스 체인**: Avalanche Fuji (테스트넷)
- **목적지 체인**: Dispatch

## ⚠️ 주의사항

- 테스트넷 환경에서만 사용하세요
- 실제 자산을 전송하지 마세요
- Core Wallet의 네트워크가 Avalanche Fuji로 설정되어 있는지 확인하세요

## 🔗 유용한 링크

- [Avalanche Documentation](https://docs.avax.network/)
- [Core Wallet](https://core.app/)
- [Avalanche Faucet](https://faucet.avax.network/)
- [Avalanche Explorer](https://subnets.avax-test.network/)

## 📝 라이선스

MIT
# Avalanche_ICM_Messaging
