import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { avalancheFuji as clientAvalancheFuji } from "@avalanche-sdk/client/chains";
import { getCoreWalletProvider, hasCoreWallet } from "../utils/getProvider";

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
    hasCoreWallet: hasCoreWallet(),
  });

  // 지갑 연결
  const connect = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = await getCoreWalletProvider();

      if (!provider) {
        throw new Error(
          "Core Wallet이 설치되어 있지 않습니다. https://core.app/ 에서 설치해주세요."
        );
      }

      // 계정 요청
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];

      // 현재 체인 ID 확인
      const currentChainId = await provider.request({
        method: "eth_chainId",
      });

      const targetChainId = "0xa869"; // 43113 (Avalanche Fuji)
      console.log("현재 체인 ID:", currentChainId);
      console.log("목표 체인 ID:", targetChainId);

      // 체인이 다르면 전환 요청
      if (currentChainId !== targetChainId) {
        console.log("⚠️ 체인 전환 필요: Avalanche Fuji로 전환 중...");

        try {
          // 체인 전환 시도
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: targetChainId }],
          });
          console.log("✅ Avalanche Fuji로 체인 전환 완료");
        } catch (switchError: any) {
          // 체인이 지갑에 추가되지 않은 경우 (4902)
          if (switchError.code === 4902) {
            console.log("⚠️ Fuji 체인 추가 중...");
            try {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: targetChainId,
                    chainName: "Avalanche Fuji Testnet",
                    nativeCurrency: {
                      name: "AVAX",
                      symbol: "AVAX",
                      decimals: 18,
                    },
                    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
                  },
                ],
              });
              console.log("✅ Avalanche Fuji 체인 추가 및 전환 완료");
            } catch (addError) {
              console.error("체인 추가 실패:", addError);
              throw new Error(
                "Avalanche Fuji 체인을 추가하는데 실패했습니다. 지갑에서 수동으로 추가해주세요."
              );
            }
          } else {
            console.error("체인 전환 실패:", switchError);
            throw new Error(
              "Avalanche Fuji 체인으로 전환하는데 실패했습니다. 지갑에서 수동으로 전환해주세요."
            );
          }
        }
      }

      // Avalanche Wallet Client 생성
      const walletClient = createAvalancheWalletClient({
        account: {
          evmAccount: {
            address: account,
            type: "json-rpc",
          },
        } as any,
        chain: clientAvalancheFuji,
        transport: { type: "custom", provider }, // Core provider 사용
      });

      setState({
        account,
        isConnected: true,
        walletClient,
        isLoading: false,
        error: null,
        hasCoreWallet: true,
      });

      console.log("✅ Core Wallet 연결 성공:", account);
      console.log("isConnected: true");
    } catch (err: any) {
      console.error("지갑 연결 오류:", err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "지갑 연결에 실패했습니다.",
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
      hasCoreWallet: hasCoreWallet(),
    });
    console.log("지갑 연결 해제");
  };

  // 계정 및 체인 변경 감지
  useEffect(() => {
    let isMounted = true;

    getCoreWalletProvider().then((provider) => {
      if (!isMounted || !provider) return;

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== state.account && state.isConnected) {
          // 계정이 변경되면 상태만 업데이트
          setState((prev) => ({
            ...prev,
            account: accounts[0],
          }));
          console.log("계정 변경됨:", accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log("체인 변경됨:", chainId);
        const targetChainId = "0xa869"; // 43113 (Avalanche Fuji)

        if (chainId !== targetChainId) {
          console.warn(
            "⚠️ 잘못된 체인으로 변경되었습니다. Avalanche Fuji (43113)를 사용해주세요."
          );
          setState((prev) => ({
            ...prev,
            error:
              "잘못된 네트워크입니다. Avalanche Fuji 테스트넷으로 전환해주세요.",
          }));
        } else {
          console.log("✅ 올바른 체인 (Avalanche Fuji)");
          // 에러 메시지 초기화
          setState((prev) => ({
            ...prev,
            error: null,
          }));
        }

        // 체인 변경 시 페이지 새로고침 (권장사항)
        window.location.reload();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);

      return () => {
        if (provider?.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
        }
      };
    });

    return () => {
      isMounted = false;
    };
  }, [state.account, state.isConnected]);

  // 디버깅용
  useEffect(() => {
    console.log("Wallet State Updated:", {
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
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
