import { useWallet } from '../contexts/WalletContext';

export function WalletConnect() {
  const { account, isConnected, isLoading, error, connect, disconnect, hasCoreWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {!hasCoreWallet && (
        <div className="warning">
          <p>⚠️ Core Wallet이 감지되지 않았습니다.</p>
          <a href="https://core.app/" target="_blank" rel="noopener noreferrer" className="install-link">
            Core Wallet 설치하기
          </a>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {!isConnected ? (
        <button 
          onClick={connect} 
          disabled={isLoading || !hasCoreWallet}
          className="connect-button"
        >
          {isLoading ? '연결 중...' : '🦊 Core Wallet 연결'}
        </button>
      ) : (
        <div className="connected">
          <div className="account-info">
            <span className="status-dot">●</span>
            <span className="account-address">{formatAddress(account!)}</span>
          </div>
          <button onClick={disconnect} className="disconnect-button">
            연결 해제
          </button>
        </div>
      )}
    </div>
  );
}

