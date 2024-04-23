import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { isTestnet } from 'config';
import { defineChain } from 'viem';
import { arbitrum, optimism, polygon } from 'viem/chains';

export const urlSettings = getHashUrlQueryParam(window.location.href);
export const arbitrumSepolia = defineChain({
  id: 421614,
  name: 'Arbitrum Sepolia',
  network: 'arb-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'AETH',
  },
  rpcUrls: {
    default: {
      http: ['https://arbitrum-sepolia.blockpi.network/v1/rpc/public'],
    },
    public: {
      http: ['https://arbitrum-sepolia.blockpi.network/v1/rpc/public'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://api-sepolia.arbiscan.io/api' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 81930,
    },
  },
  testnet: true,
});

export const optimismSepolia = defineChain({
  id: 11155420,
  name: 'Optimism Sepolia',
  network: 'optimism-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'OETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.optimism.io'],
    },
    public: {
      http: ['https://sepolia.optimism.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://sepolia-optimism.etherscan.io/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1620204,
    },
  },
  testnet: true,
});

export function getSupportedChains() {
  return isTestnet ? [arbitrumSepolia] : [arbitrum];
}

export const getAllChains = () => {
  switch (urlSettings?.chain) {
    case 'arbitrum':
      return isTestnet ? [optimismSepolia] : [optimism];
    case 'optimism':
      return isTestnet ? [optimismSepolia] : [optimism];
    default:
      return isTestnet ? [optimismSepolia] : [optimism];
  }
};
