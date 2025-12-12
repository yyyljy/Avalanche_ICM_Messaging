import { defineChain } from 'viem';
import type { ChainConfig } from '@avalanche-sdk/interchain';

// T1K (Team 1 Korea) 체인 설정
export const t1k = defineChain({
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
    default: { 
      name: 'T1K Explorer', 
      url: 'https://explorer-test.avax.network/t1k',
    },
  },
  contracts: {
    teleporterMessenger: {
      address: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
    },
    teleporterRegistry: {
      address: '0xE329B5Ff445E4976821FdCa99D6897EC43891A6c',
    },
  },
  interchainContracts: {
    teleporterRegistry: '0xE329B5Ff445E4976821FdCa99D6897EC43891A6c',
    teleporterManager: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
  },
  testnet: true,
} as any) as ChainConfig;

export const AVAILABLE_CHAINS = {
  dispatch: {
    id: 'dispatch',
    name: 'Dispatch L1',
  },
  t1k: {
    id: 't1k',
    name: 'T1K (Team 1 Korea)',
  },
} as const;

export type ChainId = keyof typeof AVAILABLE_CHAINS;

