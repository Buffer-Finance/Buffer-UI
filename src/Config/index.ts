import { IAsset } from '@Contexts/Global/interfaces';

export const DEFAULT_GAS_LIMIT = 15000000;

export const supportedWallets =
  import.meta.env.VITE_ENV.toLowerCase() === 'testnet'
    ? [
        { name: 'Metamask', img: 'metamask', connectorId: 0 },
        { name: 'Coin98', img: 'coin98', connectorId: 1 },
        { name: 'Trust Wallet', img: 'trust_wallet', connectorId: 2 },
        {
          name: 'Wallet Connect',
          img: 'wallet_connect',
          connectorId: 3,
        },
        // {
        //   name: "Tally Ho",
        //   img: "tally_ho",
        //   connectorId: 2,
        // },
        // {
        //   name: "Coinbase",
        //   img: "coinbase",
        //   connectorId: 1,
        // },
      ]
    : [
        { name: 'Metamask', img: 'metamask', connectorId: 0 },
        { name: 'Coin98', img: 'coin98', connectorId: 1 },
        { name: 'Trust Wallet', img: 'trust_wallet', connectorId: 2 },
        {
          name: 'Wallet Connect',
          img: 'wallet_connect',
          connectorId: 3,
        },
        {
          name: 'Tally Ho',
          img: 'tally_ho',
          connectorId: 2,
        },
        {
          name: 'Coinbase',
          img: 'coinbase',
          connectorId: 1,
        },
      ];

interface IAssetConfig extends IAsset {
  symbol: string;
  decimals: number;
  faucet?: {
    step: string;
    url: string;
    options?: {
      step: string;
      url: string;
    }[];
  }[];
}
interface IChainConfig {
  env: string;
  name: string;
  chainId: string;
  img: string;
  displayName: string;
  chainIdHex: string;
  chainName: string;
  nativeAsset: IAssetConfig;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  rollupTypeHash?: string;
  ethAccountLockCodeHash?: string;
  supportedPages?: number[];
  minGasPrice?: number;
  gasKey?: string;
}

export const toHex = (num: number) => {
  return `0x${num.toString(16)}`;
};

export const CHAIN_CONFIGS = {
  TESTNET: {
    ARBITRUM: {
      img: '/Chains/ARBITRIUM.png',
      env: 'arbitrum-test',
      name: 'ARBITRUM',
      displayName: 'Arbitrum',
      chainId: '421614',
      defaultAsset: 'ETH',
      chainIdHex: toHex(421614),
      chainName: `Arbitrum Goerli`,
      nativeAsset: {
        name: 'AETH',
        symbol: 'AETH',
        faucet: [
          {
            step: 'Claim goerliETH from goerli faucet',
            url: 'https://goerlifaucet.com/',
            options: [
              {
                step: 'Using the Goerli faucet',
                url: 'https://goerlifaucet.com/',
              },
              {
                step: 'Using the Goerli Mudit faucet',
                url: 'https://goerli-faucet.mudit.blog/',
              },
              {
                step: 'Using the Paradigm Multifaucet',
                url: 'https://faucet.paradigm.xyz/',
              },
            ],
          },
          {
            step: 'Bridge GoerliETH to AETH',
            url: 'https://bridge.arbitrum.io/?l2ChainId=421614',
          },
        ],
        img: '/Chains/ARBITRIUM.png',
        decimals: 18,
        category: 'Crypto',
      },
      rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
      gasKey: 'https://gasstation-mainnet.matic.network/v2',

      blockExplorerUrls: [`https://goerli-rollup-explorer.arbitrum.io/`],
      supportedPages: [1, 1, 1, 1, 1, 0],
    } as IChainConfig,
  },
  MAINNET: {
    BSC: {
      img: '/Chains/BSC.png',
      env: 'mainnet',
      name: 'BSC',
      displayName: 'Binance',
      chainId: '56',
      chainIdHex: toHex(56),
      defaultAsset: 'BNB',
      chainName: `Binance Smart Chain Mainnet`,
      nativeAsset: {
        name: 'BNB',
        symbol: 'BNB',
        img: '/Chains/BSC.png',
        decimals: 18,
        category: 'Crypto',
      },
      rpcUrls: ['https://bsc-dataseed1.binance.org/'],
      blockExplorerUrls: [`https://bscscan.com/`],
      supportedPages: [0, 0, 0, 0, 0, 1],
    } as IChainConfig,

    ARBITRUM: {
      img: '/Chains/ARBITRIUM.png',
      env: 'arbitrum-main',
      chainId: '42161',
      defaultAsset: 'ETH',
      chainIdHex: toHex(42161),
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://arbiscan.io/'],
      chainName: `Arbitrum Mainnet`,
      displayName: 'Arbitrum',
      name: 'ARBITRUM',
      minGasPrice: 0.17 * 1e9,
      nativeAsset: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        img: '/Chains/ARBITRIUM.png',
        category: 'Crypto',
      },
      supportedPages: [1, 1, 1, 1, 1, 0],
    },
  },
};

export const CHAIN_CONFIG =
  CHAIN_CONFIGS[
    import.meta.env.VITE_ENV.toUpperCase() as 'MAINNET' | 'TESTNET'
  ];
