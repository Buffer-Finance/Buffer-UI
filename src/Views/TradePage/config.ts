import { notificationPosition, tradePanelPosition } from './type';

export const appConfig = {
  '421613': {
    graph: {
      MAIN: 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/instant-trading-arbitrum-testnet/api',
    },
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    referral_storage: '0x7Fd89bE6309Dcb7E147D172E73F04b52cee6313a',
    router: '0x4fdc32a6588612589020F1dd7F106f0Ac8F8Fe6e',
    creation_window: '0x72b9de12C4FBBAc17f3394F7EA3aDE315d83C7c1',
    signer_manager: '0xB0BA28f15Ebc9685ec89Cbe8C5E6e960d14f488b',
    poolsInfo: {
      '0xE1630ecC83da4564300837E994d4AB8cE0995455': {
        tokenAddress: '0x4B5ed6b788e22D7bBe4790A4D6bE8f3A3FFC470E',
        faucet: '0x51469Ec9B8AE9B3Fbf985e735C2E3758FbD4e408',
        decimals: 6,
        token: 'USDC',
        is_pol: false,
      },
    },

    EarnConfig: {
      RewardRouter: '0x2033f87A0956388C25Ce5A21F97EE78DD37c5D7f',
      BLP: '0xb2685B520Eb93769755b0B2c96dca1D10459F378',
      iBFR: '0x89fEF05446aEA764C53a2f09bB763876FB57ea8E',
      ES_BFR: '0x92faca5302789730b427c04bc9A111b5733C054F',
      BN_BFR: '0x8d3B227ebf5424f9b324908037bdD1db71F66521',
      USDC: '0x49932a64C16E8369d73EA9342a97912Cb90e75C2',
      StakedBfrTracker: '0xe243e72224b9E295551790b2C57638A27b8493af',
      BonusBfrTracker: '0xd9497B39399149D7572A7D740487F6e016C5D37e',
      FeeBfrTracker: '0x39bcb63F0F4427CB9A21D4c3D957Bd8695f67B6d',
      StakedBlpTracker: '0x72423B589367b35024531Dd57172E56524c2233f',
      FeeBlpTracker: '0x1B128C9456d29032429d69B5630A737D75D65eC0',
      BfrVester: '0x961F8988962a2A62ae6a189C0Af576eea40A7912',
      BlpVester: '0xA37089c619A27Ce0C70F5E6CE03fD8955a46098C',
      StakedBfrDistributor: '0x1CBbff0d3928c35C1A41566e84AB1Efaa28f6770',
      StakedBlpDistributor: '0xc0d7cde3632fBF84E8A6d7c79FC0948731EC91eb',
      RewardRouter2: '0x0ED56F7684FA63A1e6bcd1f78608681c23Bd0f6E',
      BLP2: '0xfa7C3782d45eC60624C67891C60e2FAE17fE4cE6',
      StakedBlpTracker2: '0x6A7330305B47C6019473a7959c88e35e8b46bB93',
      FeeBlpTracker2: '0x81486d4A96a62CbF7a67D8cDAa5E989c107018a4',
      BlpVester2: '0x1F74Bec8987f9FffECA4A64b174321d9dc8c0257',
      StakedBlpDistributor2: '0x2F63b39D42ff8d68Aa2DfEBAC541f43D0fa9f883',
      ARB: '0x76Bd15f52dd4A6B274f2C19b16F4934eC27615a8',
    },

    DashboardConfig: {
      uniswap: '0xB529f885260321729D9fF1C69804c5Bf9B3a95A5',
      xcal: '0xAaAc379C2Fc98F59bdf26BD4604d4F084310b23D',
      camelot: '0x47ECF602a62BaF7d4e6b30FE3E8dD45BB8cfFadc',
      usdcLiquidityAddress: '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
      bfrLiquidityAddress: '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
      JLPPoolAddress: '0x97dcc5574B76b91008b684C58DfdF95fE39FA772',
      LBTPoolAddress: '0x3A3DA6464bEe25a1d98526402a12241B0787b84C',
    },
  },
};

export const refreshInterval = 500;
export const defaultSettings = {
  trade: {
    partialFill: true,
    slippageTolerance: 0.5,
    limitOrdersExpiry: '24',
    selectedTimeFrame: 'h',
  },
  share: {
    showTradeSize: false,
    showSharePopup: true,
  },
  premium: {
    showRecentTrades: true,
  },
  miscs: {
    showFavoriteAsset: true,
  },
  tradePanelPosition: tradePanelPosition.Right,
  notificationPosition: notificationPosition.BottomRight,
};

export const defaultSelectedTime = '00:15';
export const oneSec = 1000;
export const durations = [
  {
    duration: 1 * 60,
    time: '00:01',
    name: ['1m'],
  },
  // {
  //   duration: 3 * 60 * oneSec,
  //   time: '00:03',
  //   name: ['3m'],
  // },
  {
    duration: 5 * 60,
    time: '00:05',
    name: ['5m'],
  },
  {
    duration: 15 * 60,
    time: '00:15',
    name: ['15m'],
  },
  {
    duration: 60 * 60,
    time: '01:00',
    name: ['1h'],
  },
  {
    duration: 4 * 60 * 60,
    time: '04:00',
    name: ['4h'],
  },
];

export const SLIPPAGE_DEFAULTS = [0.1, 0.5, 1.0];
export const MAX_SLIPPAGE = 5;

export const marketsForChart = {
  BTCUSD: {
    category: 'Crypto',
    tv_id: 'BTCUSD',
    pair: 'BTC-USD',
    price_precision: 100,
    token0: 'BTC',
    token1: 'USD',
    full_name: 'Bitcoin',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/btc.svg',
    pythId:
      '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  },
  ETHUSD: {
    category: 'Crypto',
    tv_id: 'ETHUSD',
    pair: 'ETH-USD',
    price_precision: 100,
    token0: 'ETH',
    token1: 'USD',
    full_name: 'Ethereum',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/btc.svg',
    pythId:
      '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  },
  EURUSD: {
    category: 'Forex',
    tv_id: 'EURUSD',
    pair: 'EUR-USD',
    price_precision: 1000000,
    token0: 'EUR',
    token1: 'USD',
    full_name: 'Euro',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/euro.png',
    pythId:
      '0xa995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b',
  },
  GBPUSD: {
    category: 'Forex',
    tv_id: 'GBPUSD',
    pair: 'GBP-USD',
    price_precision: 1000000,
    token0: 'GBP',
    token1: 'USD',
    full_name: 'Pound',
    img: 'https://cdn.buffer.finance/Buffer-Media/main/GBP.png',
    pythId:
      '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1',
  },
  SOLUSD: {
    category: 'Crypto',
    tv_id: 'SOLUSD',
    pair: 'SOL-USD',
    price_precision: 100,
    token0: 'SOL',
    token1: 'USD',
    full_name: 'Solana',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/sol.svg',
    pythId:
      '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  },
  LINKUSD: {
    category: 'Crypto',
    tv_id: 'LINKUSD',
    pair: 'LINK-USD',
    price_precision: 100,
    token0: 'LINK',
    token1: 'USD',
    full_name: 'Chainlink',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/link.svg',
    pythId:
      '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
  },
  XAUUSD: {
    category: 'Commodity',
    tv_id: 'XAUUSD',
    pair: 'XAU-USD',
    price_precision: 100,
    token0: 'XAU',
    token1: 'USD',
    full_name: 'Gold',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/xau.svg',
    pythId:
      '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2',
  },
  XAGUSD: {
    category: 'Commodity',
    tv_id: 'XAGUSD',
    pair: 'XAG-USD',
    price_precision: 1000,
    token0: 'XAG',
    token1: 'USD',
    full_name: 'Silver',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/xag.svg',
    pythId:
      '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e',
  },
  AUDUSD: {
    category: 'Forex',
    tv_id: 'AUDUSD',
    pair: 'AUD-USD',
    price_precision: 1000000,
    token0: 'AUD',
    token1: 'USD',
    full_name: 'Australian Dollar',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/aud1.svg',
    pythId:
      '0x67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80',
  },
  USDJPY: {
    category: 'Forex',
    tv_id: 'USDJPY',
    pair: 'USD-JPY',
    price_precision: 1000000,
    token0: 'USD',
    token1: 'JPY',
    full_name: 'United States Dollar',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/USDC.svg',
    pythId:
      '0xef2c98c804ba503c6a707e38be4dfbb16683775f195b091252bf24693042fd52',
  },
  NZDUSD: {
    category: 'Forex',
    tv_id: 'NZDUSD',
    pair: 'NZD-USD',
    price_precision: 1000000,
    token0: 'NZD',
    token1: 'USD',
    full_name: 'New Zealand Dollar',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/nzd.svg',
    pythId:
      '0x92eea8ba1b00078cdc2ef6f64f091f262e8c7d0576ee4677572f314ebfafa4c7',
  },
  USDCHF: {
    category: 'Forex',
    tv_id: 'USDCHF',
    pair: 'USD-CHF',
    price_precision: 1000000,
    token0: 'USD',
    token1: 'CHF',
    full_name: 'United States Dollar',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/USDC.svg',
    pythId:
      '0x0b1e3297e69f162877b577b0d6a47a0d63b2392bc8499e6540da4187a63e28f8',
  },
  USDCAD: {
    category: 'Forex',
    tv_id: 'USDCAD',
    pair: 'USD-CAD',
    price_precision: 1000000,
    token0: 'USD',
    token1: 'CAD',
    full_name: 'United States Dollar',
    img: 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/USDC.svg',
    pythId:
      '0x3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca',
  },
  ARBUSD: {
    category: 'Crypto',
    tv_id: 'ARBUSD',
    pair: 'ARB-USD',
    price_precision: 100,
    token0: 'ARB',
    token1: 'USD',
    full_name: 'Arbitrum',
    pythId:
      '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
  },
  BNBUSD: {
    category: 'Crypto',
    tv_id: 'BNBUSD',
    pair: 'BNB-USD',
    price_precision: 100,
    token0: 'BNB',
    token1: 'USD',
    full_name: 'Binance Coin',
    pythId:
      '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  },
  MATICUSD: {
    category: 'Crypto',
    tv_id: 'MATICUSD',
    pair: 'MATIC-USD',
    price_precision: 100,
    token0: 'MATIC',
    token1: 'USD',
    full_name: 'Matic',
    pythId:
      '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52',
  },
  OPUSD: {
    category: 'Crypto',
    tv_id: 'OPUSD',
    pair: 'OP-USD',
    price_precision: 100,
    token0: 'OP',
    token1: 'USD',
    full_name: 'Optimism',
    pythId:
      '0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf',
  },
};

export const baseUrl = import.meta.env.VITE_INSTANT_TRADING_HOST;
export const pricePublisherBaseUrl = import.meta.env.VITE_PRICE_QUERY_HOST;
