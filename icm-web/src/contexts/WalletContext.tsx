import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createAvalancheWalletClient } from '@avalanche-sdk/client';
import { avalancheFuji as clientAvalancheFuji } from '@avalanche-sdk/client/chains';

interface WalletState {
  account: string | null;
  isConnected: boolean;
  walletClient: any | null;
  isLoading: boolean;
  error: string | null;
  hasCoreWallet: boolean;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    account: null,
    isConnected: false,
    walletClient: null,
    isLoading: false,
    error: null,
    hasCoreWallet: typeof window.ethereum !== 'undefined',
  });

  // 지갑 연결
  const connect = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (typeof window.ethereum === 'undefined') {
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
        isLoading: false,
        error: null,
        hasCoreWallet: true,
      });

      console.log('✅ 지갑 연결 성공:', account);
      console.log('isConnected: true');
    } catch (err: any) {
      console.error('지갑 연결 오류:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || '지갑 연결에 실패했습니다.',
      }));
    }
  };

  // 지갑 연결 해제
  const disconnect = () => {
    setState({
      account: null,
      isConnected: false,
      walletClient: null,
      isLoading: false,
      error: null,
      hasCoreWallet: typeof window.ethereum !== 'undefined',
    });
    console.log('지갑 연결 해제');
  };

  // 계정 변경 감지
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== state.account && state.isConnected) {
          // 계정이 변경되면 상태만 업데이트
          setState((prev) => ({
            ...prev,
            account: accounts[0],
          }));
          console.log('계정 변경됨:', accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [state.account, state.isConnected]);

  // 디버깅용
  useEffect(() => {
    console.log('Wallet State Updated:', {
      isConnected: state.isConnected,
      account: state.account,
      hasWalletClient: !!state.walletClient,
    });
  }, [state.isConnected, state.account, state.walletClient]);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

