import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { isTestnet } from 'config';
import { defineChain } from 'viem';
import { arbitrum, polygon, polygonMumbai } from 'viem/chains';

export const urlSettings = getHashUrlQueryParam(window.location.href);
const arbitrumSepolia = defineChain({
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
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
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

const blastSepolia = defineChain({
  id: 168587773,
  name: 'Blast Sepolia',
  network: 'blast-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'AETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.blast.io'],
    },
    public: {
      http: ['https://sepolia.blast.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.blastscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xb41e43f6AD6183e58C44aa3C914d0a794e8D1b68',
      blockCreated: 748004,
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
      return isTestnet
        ? [blastSepolia, arbitrumSepolia, polygonMumbai]
        : [arbitrum, polygon];
    case 'polygon':
      return isTestnet ? [polygonMumbai, arbitrumSepolia] : [polygon, arbitrum];
    default:
      return isTestnet ? [blastSepolia, arbitrumSepolia] : [arbitrum, polygon];
  }
};
