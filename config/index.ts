import { IAsset } from 'src/contexts/Global/interfaces';
export const defaultPair = 'GBP-USD';

const toHex = (num: number) => {
  return `0x${num.toString(16)}`;
};
interface IAssetConfig extends IAsset {
  symbol: string;
  decimals: number;
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

export const isTestnet = import.meta.env.VITE_ENV.toUpperCase() === 'TESTNET';

export const periodsValue = [86400, 259200, 604800, 2592000, 5184000, 7776000];
export const optionsPeriodsValue = [
  86400, 604800, 1209600, 1814400, 2419200, 2592000, 5184000, 7776000,
];
export const pgTabs = ['Predictions', 'Active', 'History'];
export const optionsTabs = ['Options', 'Active', 'History'];
export const lpTabs = ['Add Liquidity'];
export const cbTabs = ['Call Boosters', 'History'];
export const spTabs = ['Buy', 'Active', 'History'];
export const kpiTabs = ['KPI Options', 'History'];
export const binaryTabs = [
  'Place Trade',
  'Chart',
  'Active',
  'History',
  'Cancelled',
];
export const referralTabs = ['Referral'];

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
};

export const DEFAULT_GAS_LIMIT = 1500000;

export const getMobileLeaderboardTabs = () => {
  return [
    // {
    //   as: `/ARBITRUM/leaderboard/0/incentivised`,
    //   name: chain,
    //   slug: 'leaderboard',
    //   id: 0,
    // },
    {
      as: `/leaderboard/daily`,
      name: 'Daily',
      slug: 'daily',
      id: 1,
      subTabs: [],
    },
    // {
    //   pathname: '/[chain]/leaderboard/weekly',
    //   as: `/leaderboard/weekly`,
    //   name: 'Weekly',
    //   slug: 'weekly',
    //   id: 7,
    //   subTabs: [],
    // },
    {
      as: `/leaderboard/leagues/diamond`,
      name: 'diamond',
      slug: 'leagues',
      id: 2,
      img: '/LeaderBoard/Diamond.png',
      subTabs: [
        {
          as: `/leaderboard/leagues/diamond`,
          name: 'diamond',
          slug: 'diamond',
          id: 2,
          img: '/LeaderBoard/Diamond.png',
          subTabs: [],
        },
        {
          as: `/leaderboard/leagues/platinum`,
          name: 'platinum',
          slug: 'platinum',
          id: 3,
          img: '/LeaderBoard/Platinum.png',
          subTabs: [],
        },
        {
          as: `/leaderboard/leagues/gold`,
          name: 'gold',
          slug: 'gold',
          id: 4,
          img: '/LeaderBoard/Gold.png',
          subTabs: [],
        },
        {
          as: `/leaderboard/leagues/silver`,
          name: 'silver',
          slug: 'silver',
          id: 5,
          img: '/LeaderBoard/Silver.png',
          subTabs: [],
        },
        {
          as: `/leaderboard/leagues/bronze`,
          name: 'bronze',
          slug: 'bronze',
          id: 6,
          img: '/LeaderBoard/Bronze.png',
          subTabs: [],
        },
      ],
    },

    {
      as: `/leaderboard/metrics/all-time`,
      name: 'All Time',
      slug: 'metrics',
      id: 7,
      subTabs: [],
    },
  ];
};

export const getLeaderBoardTabs = () => {
  return [
    // {
    //   as: `/ARBITRUM/leaderboard/0/incentivised`,
    //   name: chain,
    //   slug: 'leaderboard',
    //   id: 0,
    // },
    {
      as: `/leaderboard/daily`,
      name: 'Daily',
      slug: 'daily',
      id: 1,
      subTabs: [],
    },
    // {
    //   as: `/leaderboard/weekly`,
    //   name: 'Weekly',
    //   slug: 'weekly',
    //   id: 7,
    //   subTabs: [],
    // },
    {
      as: `/leaderboard/leagues/diamond`,
      name: 'diamond',
      slug: 'diamond',
      id: 2,
      img: '/LeaderBoard/Diamond.png',
      subTabs: [],
    },
    {
      as: `/leaderboard/leagues/platinum`,
      name: 'platinum',
      slug: 'platinum',
      id: 3,
      img: '/LeaderBoard/Platinum.png',
      subTabs: [],
    },
    {
      as: `/leaderboard/leagues/gold`,
      name: 'gold',
      slug: 'gold',
      id: 4,
      img: '/LeaderBoard/Gold.png',
      subTabs: [],
    },
    {
      as: `/leaderboard/leagues/silver`,
      name: 'silver',
      slug: 'silver',
      id: 5,
      img: '/LeaderBoard/Silver.png',
      subTabs: [],
    },
    {
      as: `/leaderboard/leagues/bronze`,
      name: 'bronze',
      slug: 'bronze',
      id: 6,
      img: '/LeaderBoard/Bronze.png',
      subTabs: [],
    },
    {
      as: `/leaderboard/metrics/all-time`,
      name: 'All Time',
      slug: 'all-time',
      id: 7,
      subTabs: [],
    },
  ];
};
