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

export const beraChainArtio = defineChain({
  id: 80085,
  name: 'Berachain Artio',
  network: 'bera-artio',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://artio.rpc.berachain.com/'],
    },
    public: {
      http: ['https://artio.rpc.berachain.com/'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://artio.beratrail.io/' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 866924,
    },
  },
  testnet: true,
});

export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia-explorer.base.org' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1059647,
    },
  },
  testnet: true,
});

export const rskTestnet = defineChain({
  id: 31,
  name: 'RSK Testnet',
  network: 'rsk-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tRBTC',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {
      http: ['https://public-node.testnet.rsk.co'],
    },
    public: {
      http: ['https://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.testnet.rsk.co' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 2771150,
    },
  },
  testnet: true,
});

export function getSupportedChains() {
  return isTestnet
    ? [optimismSepolia, baseSepolia, beraChainArtio]
    : [optimism];
}

export const getAllChains = () => {
  switch (urlSettings?.chain) {
    case 'optimism':
      return isTestnet
        ? [optimismSepolia, baseSepolia, beraChainArtio, rskTestnet]
        : [optimism];

    case 'bera':
      return isTestnet
        ? [optimismSepolia, baseSepolia, beraChainArtio, rskTestnet]
        : [optimism];
    case 'base':
      return isTestnet
        ? [optimismSepolia, baseSepolia, beraChainArtio, rskTestnet]
        : [optimism];
    case 'rsk':
      return isTestnet
        ? [optimismSepolia, baseSepolia, beraChainArtio, rskTestnet]
        : [optimism];
    default:
      return isTestnet
        ? [optimismSepolia, baseSepolia, beraChainArtio, rskTestnet]
        : [optimism];
  }
};
