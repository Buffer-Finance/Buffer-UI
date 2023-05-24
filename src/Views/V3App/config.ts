export const v3AppConfig = {
  '421613': {
    graph: {
      MAIN: 'https://api.thegraph.com/subgraphs/name/faraday26/config-move',
    },
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    referral_storage: '0x7Fd89bE6309Dcb7E147D172E73F04b52cee6313a',
    router: '0x2d44Df5d4106C0C62893606E8956443DcA3a4Da2',
    creation_window: '0x72b9de12C4FBBAc17f3394F7EA3aDE315d83C7c1',
    poolsInfo: [
      {
        0xa3769f6e42e1d7936919904e9156527dbc23c1b4: {
          tokenAddress: '0x4B5ed6b788e22D7bBe4790A4D6bE8f3A3FFC470E',
          meta: '0xC33A64475f84C88DfB139fcFF29642a055587fe4',
          decimals: 6,
          token: 'USDC',
        },
      },
    ],

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

export const marketsForChart = {
  BTCUSD: {
    price_precision: 100,
    pair: 'BTC-USD',
    category: 'Crypto',
    fullName: 'Bitcoin',
    tv_id: 'BTCUSD',
  },
  ETHUSD: {
    price_precision: 100,
    pair: 'ETH-USD',
    category: 'Crypto',
    fullName: 'Ethereum',
    tv_id: 'ETHUSD',
  },
  GBPUSD: {
    price_precision: 100,
    pair: 'GBP-USD',
    category: 'Forex',
    fullName: 'Pound',
    tv_id: 'GBPUSD',
  },
  EURUSD: {
    price_precision: 100,
    pair: 'EUR-USD',
    category: 'Forex',
    fullName: 'Euro',
    tv_id: 'EURUSD',
  },
};
