import { Chain } from "wagmi";

export const bscTestnet: Chain = {
  id: 97,
  name: "BSC",
  network: "Binance Smart Chain Testnet",
  rpcUrls: { default: "https://data-seed-prebsc-1-s1.binance.org:8545/" },
  testnet: true,
  nativeCurrency: { decimals: 18, name: "BNB", symbol: "BNB" },
  blockExplorers: {
    default: {
      name: "BNB Smart Chain Testnet Explorer",
      url: "https://testnet.bscscan.com/",
    },
  },
  multicall: {
    blockCreated: 9759845,
    address: "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576",
  },
};

export const bscMainnet: Chain = {
  id: 56,
  name: "BSC",
  network: "Binance Smart Chain Mainnet",
  rpcUrls: { default: "https://bsc-dataseed1.binance.org/" },
  testnet: false,
  nativeCurrency: { decimals: 18, name: "BNB", symbol: "BNB" },
  blockExplorers: {
    default: {
      name: "BNB Smart Chain Explorer",
      url: "https://bscscan.com/",
    },
  },
  multicall: {
    blockCreated: 7162653,
    address: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
  },
};
