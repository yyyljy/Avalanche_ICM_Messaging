import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalancheFuji as clientAvalancheFuji } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { createICMClient, avalancheFuji, dispatch, ChainConfig } from "@avalanche-sdk/interchain";
import { defineChain } from "viem";

export const T1K = defineChain({
  id: 54585,
  name: 'T1K',
  blockchainId: '0xd64bda92358ad0c136f76e8971a0281c50b48e97b12eea18d20e6552463cd336',
  nativeCurrency: {
    decimals: 18,
    name: 'T1K',
    symbol: 'T1K',
  },
  rpcUrls: {
    default: {
      http: ['https://subnets.avax.network/t1k/testnet/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'T1K Explorer', url: 'https://explorer-test.avax.network/t1k' },
  },
  contracts: {
    teleporterRegistry: {
      address: '0xE329B5Ff445E4976821FdCa99D6897EC43891A6c'
    }
  },
  interchainContracts: {
    teleporterRegistry: '0xE329B5Ff445E4976821FdCa99D6897EC43891A6c',
    teleporterManager: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
  },
  testnet: true
}) as ChainConfig;

/**
 * ICM 메시지를 보내는 예제
 * 
 * 사용 방법:
 * 1. PRIVATE_KEY 환경 변수를 설정하거나 아래 코드에서 직접 설정
 * 2. npm install @avalanche-sdk/interchain @avalanche-sdk/client
 * 3. ts-node send-icm-message.ts 실행
 */

async function sendICMMessage() {
  try {
    // 1. 개인키 설정 (환경 변수에서 가져오거나 직접 설정)
    const privateKey = process.env.PRIVATE_KEY || "0x..."; // 실제 개인키로 교체 필요
    
    if (privateKey === "0x...") {
      throw new Error("PRIVATE_KEY 환경 변수를 설정하거나 코드에서 개인키를 설정해주세요.");
    }

    // 2. 계정 생성
    const account = privateKeyToAvalancheAccount(privateKey);
    console.log("계정 주소:", account.getEVMAddress());

    // 3. Wallet Client 생성
    const wallet = createAvalancheWalletClient({
      account,
      chain: clientAvalancheFuji,
      transport: { type: "http" },
    });
    console.log("Wallet Client 생성 완료");

    // 4. ICM Client 초기화
    // const icm = createICMClient(wallet, avalancheFuji, T1K);
    // const icm = createICMClient(wallet, T1K, avalancheFuji);
    const icm = createICMClient(wallet, avalancheFuji, dispatch);
    console.log("ICM Client 초기화 완료");

    // 5. 메시지 전송
    // const message = "Hello from Avalanche!";
    const message = "L1으로 보내보는 메세지";
    console.log(`메시지 전송 중: "${message}"`);
    console.log(`소스 체인: ${avalancheFuji.name}`);
    // console.log(`목적지 체인: ${dispatch.name}`);
    console.log(`목적지 체인: ${T1K.name}`);

    const hash = await icm.sendMsg({
      sourceChain: avalancheFuji,
      // sourceChain: T1K,
      destinationChain: dispatch,
      // destinationChain: avalancheFuji,
      // destinationChain: T1K,
      message: message,
    });

    console.log("✅ 메시지 전송 성공!");
    console.log("트랜잭션 해시:", hash);

    return hash;
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    throw error;
  }
}

// 예제 실행
if (require.main === module) {
  sendICMMessage()
    .then(() => {
      console.log("\n프로그램 종료");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n프로그램 실패:", error);
      process.exit(1);
    });
}

export { sendICMMessage };

