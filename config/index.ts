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
export const insuaranceTabs = ['Secured Put', 'History'];
export const referralTabs = ['Referral'];
export const stakingTabs = ['Staking'];
export const revenueTabs = ['Revenue Sharing'];
export const vaultTabs = ['Vault'];
export const proIdentifier = 'pro';
export const positionsTabs = ['Active', 'History'];
export const allTradesTabs = ['History', 'Old Trades'];
export const breakPoint = 1200;

export const TESTNET_ENVS = [
  'meter-test',
  'cube-test',
  'stardust-test',
  'mumbai-test',
];
/**
 [
  0 - binary
  1 - faucet
  2 - competition
  3 - earn
  4 - referral
  5 - migration
 ]
 */
export const MAINNET_ENVS = ['mainnet', 'avalanche-mainnet', 'aurora-mainnet'];
// if you don't mention exact RPC URL and Block Explorer URL, Chain won't be switched if user tries to.
// Make sure you double check if URL contains "/" at last or not.
export const CHAIN_CONFIGS = {
  TESTNET: {
    ARBITRUM: {
      img: '/Chains/ARBITRIUM.png',
      env: 'arbitrum-test',
      name: 'ARBITRUM',
      displayName: 'Arbitrum',
      chainId: '421613',
      defaultAsset: 'ETH',
      chainIdHex: toHex(421613),
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
            url: 'https://bridge.arbitrum.io/?l2ChainId=421613',
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
export const pgTypeMapping = {
  Put: 'Down',
  Call: 'Up',
  exercised: 'closed',
  active: 'active',
  expired: 'expired',
};

export const BSC_BLOCK_TIME = 3;
export const DEFAULT_GAS_LIMIT = 1500000;
export const CHAIN_CONFIG =
  CHAIN_CONFIGS[import.meta.env.VITE_ENV.toUpperCase()];
export const LONG_TIMEOUT = 50000;

export const getENV = () => {
  let chain: any = router.router.query.chain;
  if (!chain) return import.meta.env.VITE_ENV.toLowerCase();
  chain = chain.toUpperCase();
  return CHAIN_CONFIG[chain].env;
};

export const RETRY_LIMIT = 35;

export const getChain: (
  providedRouter?: any
) => [IChainConfig, string | false] = (providedRouter) => {
  let activeChain: string;
  if (providedRouter) {
    activeChain = providedRouter.query.chain as string;
  } else {
    activeChain = router.router.query.chain as string;
  }
  let notFound: boolean = false;
  if (!activeChain) {
    notFound = true;
    activeChain = 'BSC';
  }
  activeChain = activeChain.toUpperCase();
  return [CHAIN_CONFIG[activeChain], notFound ? false : activeChain];
};
export const getActiveChain: () => IChainConfig | null = () => {
  if (typeof window !== 'undefined') {
    const str = window.location.href.split('/')[3];
    return CHAIN_CONFIG[str.toUpperCase()];
  }
  return null;
};
export const getChainName = (router) => {
  const requestedChain = router.query.chain;
  if (requestedChain && requestedChain !== '') {
    const chainObj =
      CHAIN_CONFIGS[import.meta.env.VITE_ENV.toUpperCase()][
        (requestedChain as string).toUpperCase()
      ];
    if (chainObj) {
      return chainObj.chainName;
    }
  }
  return null;
};

export const BASE_URL = 'https://pancakeswap.finance';
export const LOWERCASE_ENV = import.meta.env.VITE_ENV.toLowerCase();

export const multiCall = {
  56: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
  97: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
  71393: '0x8BE87Ac9376c33C64583d0CD512227151FeD5bfe',
  80001: '0xa1D6a0B3bE26FA898340b53d130FaAc855B87545',
  43113: '0x3525056b441957683c646e60f155A5db6390144F',
  43114: '0x115452aF3dD96809F61777010215219B8B30819D',
  3: '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
  4002: '0x0f0142450b65E562dbe871975da7ED0974e20D0e',
  421613: '0x8ea98eFC38dE6739FBDC93dA7789c926D54d72c6',
  42161: '0x7A7443F8c577d537f1d8cD4a629d40a3148Dd7ee',
};

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

export const gitbookLink = 'https://github.com/Buffer-Finance/Buffer-Protocol';

export const INDEX_MAPPINGS = {
  generic: 'main',
  call_boosters: 'call_booster',
};

export const standAloneSlugs = ['NFT'];
export const expiredExpiry = 'roll-over pending';
export const rootBreak = 600;
export const notOverText = 'Round 1 is not over yet for this pool.';
export const NA = 'N/A';
export const European = 'European';
export const American = 'American';
export const getLeaderBoardTabs = () => {
  return [
    // {
    //   as: `/ARBITRUM/leaderboard/0/incentivised`,
    //   name: chain,
    //   slug: 'leaderboard',
    //   id: 0,
    // },
    {
      pathname: '/[chain]/leaderboard/galxe',
      as: `/leaderboard/galxe`,
      name: 'BBB',
      slug: 'galxe',
      id: 8,
      subTabs: [],
    },
    {
      as: `/leaderboard/daily`,
      name: 'Daily',
      slug: 'daily',
      id: 1,
      subTabs: [],
    },

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

export const getMobileLeaderboardTabs = () => {
  return [
    // {
    //   as: `/ARBITRUM/leaderboard/0/incentivised`,
    //   name: chain,
    //   slug: 'leaderboard',
    //   id: 0,
    // },
    {
      pathname: '/[chain]/leaderboard/daily',
      as: `/leaderboard/daily`,
      name: 'BBB',
      slug: 'daily',
      id: 8,
      subTabs: [],
    },
    {
      as: `/leaderboard/leagues/diamond`,
      name: 'Leagues',
      slug: 'leagues',
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
export const getProTabs = (chain: string, asset: string) => {
  return [
    {
      pathname: '/[chain]/markets/[product]',
      as: `/markets/all`,
      name: 'Markets',
      slug: 'markets',
      id: 2,
      subTabs: [],
    },
    {
      pathname: '/[chain]/partners',
      as: `/partners`,
      name: 'Partners',
      slug: 'partners',
      id: 0,
      subTabs: [],
    },
    {
      pathname: '/[chain]/positions',
      as: `/positions`,
      name: 'Positions',
      defaultName: 'Positions',
      slug: 'positions',
      id: 3,
      subTabs: [],
    },
    {
      pathname: '/[chain]/faucet',
      as: `/faucet`,
      name: 'Faucet',
      slug: 'faucet',
      id: 5,
      subTabs: [],
    },
  ];
};

export const envNetworkMapping = {
  'mumbai-testnet': 'Polygon Testnet',
};
export const getTabs = (chain: string, isLeaderboard = false) => {
  if (isLeaderboard) return getLeaderBoardTabs();

  if (import.meta.env.VITE_ENV.toLowerCase() === 'mainnet') {
    return [
      {
        pathname: '/[chain]/binary/[asset]',
        as: `/ARBITRUM/binary/${defaultPair}`,
        name: 'Trade',
        slug: 'binary',
        id: 2,
        subTabs: [],
        isExternalLink: false,
      },
      // {
      //   pathname: "/[chain]/migration",
      //   as: `https://forms.gle/Z5oXXz9fSqUN71bi6`,
      //   name: "Migrate",
      //   slug: "migration",
      //   id: 8,
      //   subTabs: [],
      //   isExternalLink: true,
      // },
      {
        pathname: '/[chain]/earn',
        as: `/ARBITRUM/earn`,
        name: 'Earn',
        slug: 'earn',
        id: 8,
        subTabs: [],
        isExternalLink: false,
      },

      {
        pathname: 'practice',
        as: `https://testnet.buffer.finance/`,
        name: 'Practice Trading',
        slug: 'practice',
        id: 8,
        subTabs: [],
        isExternalLink: true,
      },
      // {
      //   pathname: 'vesting',
      //   as: `https://app-v0.buffer.finance/vesting`,
      //   name: 'Vesting',
      //   slug: 'vesting',
      //   id: 8,
      //   subTabs: [],
      //   isExternalLink: true,
      // },
      // {
      //   pathname: 'old-App',
      //   as: `https://app-v1.buffer.finance/`,
      //   name: 'Old App',
      //   slug: 'old-app',
      //   id: 8,
      //   subTabs: [],
      //   isExternalLink: true,
      // },
      // {
      //   pathname: "blog",
      //   as: "https://buffer-finance.medium.com/",
      //   name: "Blog",
      //   slug: "blog",
      //   id: 9,
      //   subTabs: [],
      //   isExternalLink: true,
      // },
    ];
  }
  return [
    {
      pathname: '/[chain]/binary/[asset]',
      as: `/ARBITRUM/binary/${defaultPair}`,
      name: 'Trade',
      slug: 'binary',
      id: 2,
      subTabs: [],
      isExternalLink: false,
    },
    {
      pathname: '/[chain]/faucet',
      as: `/ARBITRUM/faucet`,
      name: 'Faucet',
      slug: 'faucet',
      id: 5,
      subTabs: [],
      isExternalLink: false,
    },
    // {
    //   pathname: "/[chain]/earn",
    //   as: `/ARBITRUM/earn`,
    //   name: "Earn",
    //   slug: "earn",
    //   id: 8,
    //   subTabs: [],
    //   isExternalLink: false,
    // },

    // {
    //   pathname: "/[chain]/dashboard",
    //   as: `/ARBITRUM/dashboard`,
    //   name: "Dashboard",
    //   slug: "dashboard",
    //   id: 8,
    //   subTabs: [],
    //   isExternalLink: false,
    // },
    // {
    //   pathname: "/[chain]/referral",
    //   as: `/ARBITRUM/referral`,
    //   name: "Referral",
    //   slug: "referral",
    //   id: 8,
    //   subTabs: [],
    //   isExternalLink: false,
    // },

    {
      pathname: '/[chain]/leaderboard/[offset]/incentivised',
      as: `/leaderboard/0/incentivised`,
      name: 'Competitions',
      slug: 'leaderboard',
      id: 6,
      subTabs: [],
    },
  ];
};
