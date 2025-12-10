import { createICMClient, avalancheFuji, dispatch } from '@avalanche-sdk/interchain';

export interface SendMessageParams {
  walletClient: any;
  message: string;
  sourceChain?: any;
  destinationChain?: any;
}

export interface SendMessageResult {
  txHash: string;
  messageId: string | null;
}

export async function sendICMMessage({
  walletClient,
  message,
  sourceChain = avalancheFuji,
  destinationChain = dispatch,
}: SendMessageParams): Promise<SendMessageResult> {
  try {
    // ICM Client 생성
    const icm = createICMClient(walletClient, sourceChain, destinationChain);

    // 메시지 전송
    const txHash = await icm.sendMsg({
      sourceChain,
      destinationChain,
      message,
    });

    console.log('트랜잭션 해시:', txHash);

    // 트랜잭션 receipt 가져오기
    let messageId: string | null = null;
    try {
      const receipt = await walletClient.waitForTransactionReceipt({ hash: txHash });
      console.log('트랜잭션 Receipt:', receipt);

      // 이벤트 로그에서 메시지 ID 추출
      // Teleporter의 SendCrossChainMessage 이벤트 찾기
      if (receipt.logs && receipt.logs.length > 0) {
        // 첫 번째 토픽이 이벤트 시그니처, 두 번째가 보통 indexed messageId
        for (const log of receipt.logs) {
          if (log.topics && log.topics.length > 1) {
            // messageId는 보통 두 번째 토픽
            messageId = log.topics[1];
            console.log('메시지 ID 추출:', messageId);
            break;
          }
        }
      }
    } catch (err) {
      console.warn('Receipt 확인 중 오류 (메시지는 전송됨):', err);
    }

    return { txHash, messageId };
  } catch (error: any) {
    console.error('ICM 메시지 전송 오류:', error);
    throw new Error(error.message || 'ICM 메시지 전송에 실패했습니다.');
  }
}

export { avalancheFuji, dispatch };

