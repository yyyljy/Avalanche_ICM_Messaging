import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalancheFuji as clientAvalancheFuji } from "@avalanche-sdk/client/chains";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { createICMClient, avalancheFuji, dispatch, ChainConfig } from "@avalanche-sdk/interchain";
import { defineChain } from "viem";

export const T1K = defineChain({
  id: 54585,
  name: 'T1K Testnet',
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
    default: { name: 't1k Explorer', url: 'https://subnets.avax.network/t1k' },
  },
  contracts: {
    teleporterMessenger: {
      address: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf', // 모든 체인 공통
    },
    teleporterRegistry: {
      address: '0xE329B5Ff445E4976821FdCa99D6897EC43891A6c', // AvaCloud 콘솔에서 확인
    },
  },
  interchainContracts: {
    teleporterRegistry: "0xE329B5Ff445E4976821FdCa99D6897EC43891A6c",
    teleporterManager: "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf",
  },
  testnet: true,
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
      transport: { type: "http", url: "https://api.avax-test.network/ext/bc/C/rpc" },
    });
    console.log("Wallet Client 생성 완료");

    // 4. ICM Client 초기화
    const icm = createICMClient(wallet, avalancheFuji, T1K);
    console.log("ICM Client 초기화 완료");
    console.log(`소스 체인: ${avalancheFuji.name}`);
    console.log(`목적지 체인: ${T1K.name}`);

    // 5. 메시지 전송
    const message = "SDK를 이용해 T1K로 보내보는 메세지";
    console.log(`메시지 전송 중: "${message}"`);

  //  * @param params.message - The message content to send (will be encoded as string)
  //  * @param params.sourceChain - Source blockchain configuration (required if not set in constructor)
  //  * @param params.destinationChain - Destination blockchain configuration (required if not set in constructor)
  //  * @param params.recipientAddress - Optional recipient address on destination chain (defaults to zero address)
  //  * @param params.feeInfo - Optional fee information (overrides default if provided)
  //  * @param params.requiredGasLimit - Optional gas limit (overrides default if provided)
  //  * @param params.allowedRelayerAddresses - Optional relayer addresses (overrides default if provided)
  //  *
  
    const hash = await icm.sendMsg({
      message: message,
      sourceChain: avalancheFuji,
      destinationChain: T1K,
      recipientAddress: "0x748a88f850D81EC0f5F4F51B89511d65857085D7" as `0x${string}`,
      feeInfo: {
        feeTokenAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        amount: 0n,
      },
      requiredGasLimit: 100000n,
      allowedRelayerAddresses: [],
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

