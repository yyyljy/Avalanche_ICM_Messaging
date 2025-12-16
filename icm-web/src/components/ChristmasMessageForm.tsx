import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { sendICMMessage, avalancheFuji, dispatch } from "../utils/icm";
import { t1k, AVAILABLE_CHAINS } from "../config/chains";
import type { ChainId } from "../config/chains";
import { WalletConnect } from "./WalletConnect";

export function ChristmasMessageForm() {
  const { walletClient, isConnected } = useWallet();
  const [message, setMessage] = useState("");
  const [selectedChain, setSelectedChain] = useState<ChainId>("t1k");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 선택된 체인 객체 가져오기
  const getDestinationChain = () => {
    return selectedChain === "t1k" ? t1k : dispatch;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("메시지를 입력해주세요.");
      return;
    }

    if (!walletClient || !isConnected) {
      setError("먼저 지갑을 연결해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);
    setMessageId(null);

    try {
      const result = await sendICMMessage({
        walletClient,
        message: message.trim(),
        destinationChain: getDestinationChain(),
      });

      setTxHash(result.txHash);
      setMessageId(result.messageId);
      setMessage("");
      console.log("✅ 메시지 전송 성공!");
      console.log("트랜잭션 해시:", result.txHash);
      console.log("메시지 ID:", result.messageId);
    } catch (err: any) {
      console.error("메시지 전송 오류:", err);
      setError(err.message || "메시지 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="christmas-letter">
      <div className="letter-paper">
        {/* 크리스마스 장식 */}
        <div className="christmas-decorations">
          <span className="decoration">🎄</span>
          <span className="decoration">⭐</span>
          <span className="decoration">🎄</span>
        </div>

        <h2 className="letter-title">🎅 Christmas ICM Letter</h2>

        {/* From 섹션 - 지갑 연결 */}
        <div className="letter-from">
          <label className="from-label">From:</label>
          <WalletConnect />
        </div>

        {/* To 섹션 - 체인 선택 */}
        <div className="letter-to">
          <label className="to-label">To:</label>
          <div className="chain-route">
            <span className="chain-tag">{avalancheFuji.name}</span>
            <span className="arrow">→</span>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as ChainId)}
              className="chain-select"
              disabled={isLoading}
            >
              {Object.entries(AVAILABLE_CHAINS).map(([id, chain]) => (
                <option key={id} value={id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 메시지 작성 폼 */}
        <form onSubmit={handleSubmit} className="letter-form">
          <div className="message-section">
            <label className="message-label">Your Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your Christmas message here... 🎁"
              rows={6}
              disabled={!isConnected || isLoading}
              className="message-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={!isConnected || isLoading || !message.trim()}
            className="send-letter-button"
          >
            {isLoading ? "🎁 Sending..." : "📮 Send Letter"}
          </button>
        </form>

        {/* 에러 메시지 */}
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {/* 성공 메시지 */}
        {txHash && (
          <div className="success-message">
            <p>🎉 Your Christmas letter has been sent!</p>
            <div className="tx-info">
              <span className="tx-label">Transaction Hash:</span>
              <code className="tx-hash">{txHash}</code>
            </div>
            {messageId && (
              <div className="tx-info">
                <span className="tx-label">Message ID:</span>
                <code className="tx-hash">{messageId}</code>
              </div>
            )}
            <div className="explorer-links">
              <a
                href={`https://testnet.snowtrace.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-link"
              >
                View on Snowtrace 🔍
              </a>
              {messageId && (
                <a
                  href={`https://explorer-test.avax.network/teleporter/${messageId.replace(
                    "0x",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explorer-link"
                >
                  View on Teleporter Explorer 📡
                </a>
              )}
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        {!isConnected && (
          <div className="info-message">
            <p>🎄 Please connect your wallet to send a Christmas letter!</p>
          </div>
        )}

        {/* 크리스마스 하단 장식 */}
        <div className="letter-footer-decoration">
          <span>❄️</span>
          <span>🎁</span>
          <span>🔔</span>
          <span>🎁</span>
          <span>❄️</span>
        </div>
      </div>
    </div>
  );
}
