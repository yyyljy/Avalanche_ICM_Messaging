import { useState, useEffect } from 'react';
import { createAvalancheWalletClient } from '@avalanche-sdk/client';
import { avalancheFuji as clientAvalancheFuji } from '@avalanche-sdk/client/chains';

interface WalletState {
  account: string | null;
  isConnected: boolean;
  walletClient: any | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    account: null,
    isConnected: false,
    walletClient: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core Wallet 감지
  const checkCoreWallet = () => {
    if (typeof window.ethereum !== 'undefined') {
      return true;
    }
    return false;
  };

  // 지갑 연결
  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!checkCoreWallet()) {
        throw new Error('Core Wallet이 설치되어 있지 않습니다. https://core.app/ 에서 설치해주세요.');
      }

      // 계정 요청
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const account = accounts[0];

      // Avalanche Wallet Client 생성
      const walletClient = createAvalancheWalletClient({
        account: {
          evmAccount: {
            address: account,
            type: 'json-rpc',
          },
        } as any,
        chain: clientAvalancheFuji,
        transport: { type: 'custom', provider: window.ethereum },
      });

      setState({
        account,
        isConnected: true,
        walletClient,
      });
      
      console.log('✅ 지갑 연결 성공:', account);
      console.log('walletClient:', walletClient);
    } catch (err: any) {
      console.error('지갑 연결 오류:', err);
      setError(err.message || '지갑 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 지갑 연결 해제
  const disconnect = () => {
    setState({
      account: null,
      isConnected: false,
      walletClient: null,
    });
  };

  // 계정 변경 감지
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== state.account) {
          // 계정이 변경되면 상태만 업데이트 (재연결하지 않음)
          setState((prev) => ({
            ...prev,
            account: accounts[0],
          }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    isLoading,
    error,
    connect,
    disconnect,
    hasCoreWallet: checkCoreWallet(),
  };
}

