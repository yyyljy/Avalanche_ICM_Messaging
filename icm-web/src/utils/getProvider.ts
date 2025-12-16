// Core Wallet Provider 감지 유틸리티 (EIP-6963 표준 사용)

// Core provider 캐시
let coreProviderCache: any = null;
let providerCheckPromise: Promise<any> | null = null;

// EIP-6963을 사용하여 Core 지갑 감지
function detectCoreProviderViaEIP6963(): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    let resolved = false;
    const providers: any[] = [];

    function handleAnnounce(event: any) {
      const detail = event.detail;

      // Core 지갑 감지 (name 또는 rdns로 확인)
      if (
        detail?.info?.name === "Core" ||
        detail?.info?.rdns === "app.core.extension" ||
        detail?.info?.name?.toLowerCase().includes("core")
      ) {
        console.log("✅ Core Wallet detected via EIP-6963:", detail.info);

        if (!resolved) {
          resolved = true;
          coreProviderCache = detail.provider;
          resolve(detail.provider);
        }
        providers.push(detail.provider);
      }
    }

    // EIP-6963 이벤트 리스너 등록
    window.addEventListener("eip6963:announceProvider", handleAnnounce);

    // Provider 요청
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    // 500ms 대기 후 결과 반환 (모든 지갑이 응답할 시간 부여)
    setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", handleAnnounce);

      if (!resolved) {
        resolved = true;
        if (providers.length > 0) {
          coreProviderCache = providers[0];
          resolve(providers[0]);
        } else {
          resolve(null);
        }
      }
    }, 500);
  });
}

// Core Wallet Provider 가져오기
export async function getCoreWalletProvider() {
  // 캐시된 provider가 있으면 반환
  if (coreProviderCache) {
    console.log("✅ Using cached Core provider");
    return coreProviderCache;
  }

  // 이미 검색 중이면 기다림
  if (providerCheckPromise) {
    return providerCheckPromise;
  }

  // 새로운 검색 시작
  providerCheckPromise = (async () => {
    // 1순위: EIP-6963으로 Core 지갑 감지
    const eip6963Provider = await detectCoreProviderViaEIP6963();
    if (eip6963Provider) {
      return eip6963Provider;
    }

    // 2순위: window.avalanche (Core 전용 provider)
    if (typeof window !== "undefined" && (window as any).avalanche) {
      console.log("✅ Core Wallet (window.avalanche) 감지");
      coreProviderCache = (window as any).avalanche;
      return coreProviderCache;
    }

    // 3순위: window.ethereum이 Core인지 확인
    if (typeof window !== "undefined" && window.ethereum) {
      const ethereum = window.ethereum as any;

      // Core 지갑 특성 확인
      if (ethereum.isAvalanche || ethereum.isCoreWallet) {
        console.log("✅ Core Wallet (window.ethereum) 감지");
        coreProviderCache = ethereum;
        return ethereum;
      }

      // 여러 provider가 있는 경우
      if (ethereum.providers && Array.isArray(ethereum.providers)) {
        const coreProvider = ethereum.providers.find(
          (p: any) => p.isAvalanche || p.isCoreWallet
        );
        if (coreProvider) {
          console.log("✅ Core Wallet (multiple providers) 감지");
          coreProviderCache = coreProvider;
          return coreProvider;
        }
      }

      // fallback: 일반 ethereum provider
      console.log("⚠️ Core Wallet을 찾을 수 없어 기본 ethereum provider 사용");
      return ethereum;
    }

    return null;
  })();

  const result = await providerCheckPromise;
  providerCheckPromise = null; // 검색 완료 후 초기화
  return result;
}

// 동기적으로 Core Wallet 존재 여부 확인
export function hasCoreWallet(): boolean {
  if (typeof window === "undefined") return false;

  // 캐시된 provider가 있으면
  if (coreProviderCache) return true;

  // window.avalanche가 있거나
  if ((window as any).avalanche) return true;

  // window.ethereum이 Core 지갑이면
  const ethereum = window.ethereum as any;
  if (ethereum?.isAvalanche || ethereum?.isCoreWallet) return true;

  // 여러 provider 중에 Core가 있으면
  if (ethereum?.providers && Array.isArray(ethereum.providers)) {
    return ethereum.providers.some((p: any) => p.isAvalanche || p.isCoreWallet);
  }

  // EIP-6963으로 확인 (비동기이므로 즉시 false 반환)
  return false;
}

// Provider 캐시 초기화 (필요시)
export function resetProviderCache() {
  coreProviderCache = null;
  providerCheckPromise = null;
}
