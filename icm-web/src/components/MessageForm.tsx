import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { sendICMMessage, avalancheFuji, dispatch } from '../utils/icm';

export function MessageForm() {
  const { walletClient, isConnected } = useWallet();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }

    if (!walletClient) {
      setError('먼저 지갑을 연결해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await sendICMMessage({
        walletClient,
        message: message.trim(),
      });

      setTxHash(hash);
      setMessage('');
      console.log('✅ 메시지 전송 성공! 트랜잭션 해시:', hash);
    } catch (err: any) {
      console.error('메시지 전송 오류:', err);
      setError(err.message || '메시지 전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="message-form">
      <h2>📨 ICM 메시지 보내기</h2>
      
      <div className="chain-info">
        <div className="chain-box">
          <span className="chain-label">소스 체인</span>
          <span className="chain-name">{avalancheFuji.name}</span>
        </div>
        <span className="arrow">→</span>
        <div className="chain-box">
          <span className="chain-label">목적지 체인</span>
          <span className="chain-name">{dispatch.name}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">메시지 내용</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="전송할 메시지를 입력하세요..."
            rows={4}
            disabled={!isConnected || isLoading}
            className="message-input"
          />
        </div>

        <button 
          type="submit" 
          disabled={!isConnected || isLoading || !message.trim()}
          className="send-button"
        >
          {isLoading ? '전송 중...' : '메시지 전송'}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <p>❌ {error}</p>
        </div>
      )}

      {txHash && (
        <div className="success-box">
          <p>✅ 메시지가 성공적으로 전송되었습니다!</p>
          <div className="tx-hash">
            <span className="tx-label">트랜잭션 해시:</span>
            <code className="tx-value">{txHash}</code>
          </div>
          <a
            href={`https://subnets.avax-test.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            Explorer에서 확인하기 →
          </a>
        </div>
      )}

      {!isConnected && (
        <div className="info-box">
          <p>💡 메시지를 전송하려면 먼저 Core Wallet을 연결해주세요.</p>
        </div>
      )}
    </div>
  );
}

