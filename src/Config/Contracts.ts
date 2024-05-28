export const ContractsConfig = {
  421614: {
    graph: {
      MAIN: 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/above-below-sepolia/version/v0.2.1-ud-updat3e-contracts/api',
      ABOVE_BELOW:
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/above-below-sepolia/api',
      EVENTS:
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/up-down-v3-testnet/version/platform-evts-ab/api',
      REWARDS: `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/jackpot/api`,
      LEADERBOARD: `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/jackpot/version/v3.0.31-leaderboard-tracking-update-contracts/api`,
      DASHBOARD: '',
      PROFILE: '',
      LP: `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/jackpot/version/v3.0.34-lp-tracking/api`,
    },
    signer_manager: '0x4499D65378E7D6ECb152caB3893dfFBB654F9961',
    ab: {
      router: '0xc8083f764d5ce46E4DbEa3dEB975C3301c8d08aB',
    },
    ud: {
      router: '0x693351786cf6f328B1495bd9d527d898929580AE',
    },
    jackpot: '0x6D09f5606e2190e0E42E0ebD89250748981eec3C',
    poolsInfo: {
      '0x464c93cab18A051a24BD520bb97c22C583b48F01': {
        tokenAddress: '0xb180dB4293D9247Dc974F1445082ae55A91C9539',
        faucet: '0xAb4df8Aaa1F54E84C469f4bc0e513436088C9B86',
        decimals: 6,
        token: 'USDC.e',
        permitName: 'USDC',
        is_pol: false,
      },
      '0xEe8f62C080A6da2B91ab3478D58e6999daAAb8be': {
        tokenAddress: '0x7Fe2dD3b4619802B8c4b404f5e440756391439ba',
        faucet: '0xB54521E255d23F2fA7f37d29C7E76D8FFa85fc05',
        decimals: 6,
        token: 'USDC',
        permitName: 'USDC',
        is_pol: false,
      },
      '0x70086DFD2b089359A6582A18D24aBE1AcE40f8D0': {
        tokenAddress: '0x9132016099CEbb740db64A36da0D3307824Ad159',
        faucet: '0x62Db9CD484b3B59e1d0444cea1f0D0D3c00bf2F5',
        decimals: 18,
        token: 'BFR',
        permitName: 'Token',
        is_pol: false,
      },
      '0x52126176479d8aFADF2Bc32eDe79dfDdFe69189c': {
        tokenAddress: '0xd8F5E01e1723EFDdc7faA76a8C3FeFb4A8ef5b76',
        faucet: '0x6B655D99962F58B9Aa0fFB18281408CdBCf61800',
        decimals: 18,
        token: 'ARB',
        permitName: 'ARB',
        is_pol: false,
      },
    },
  },
  42161: {
    graph: {
      ABOVE_BELOW:
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.6-ab-add-usd-values/api',
      MAIN: 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.4-ud-trades-markets/api',
      EVENTS:
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/events/version/v2.5-up-events-mainnet/api',
      REWARDS: `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/jackpot/api`,
      LEADERBOARD: `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.5-leaderboard-tracking/api`,
      DASHBOARD:
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/version/v2.9.1-ud-ab-nfts-leagues-stats-defillama-merge/api',
      PROFILE:
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-mainnet/version/v2.7.2-v2.6-profile-data/api',
      LP: '',
    },
    signer_manager: '0x84cb6d8Fafa09D8A606f423feD6BB2745e677526',
    ab: {
      router: '0x94582981c3be6092b912265C2d2cE172e7f9c3B1',
    },
    ud: {
      router: '0x2BAA48961C1CD376484b601278bF7A51E94293a9',
    },
    jackpot: '0xEa0b956A04b265A7E2A6d00A4bD65a48C430cE16',
    poolsInfo: {
      '0x6Ec7B10bF7331794adAaf235cb47a2A292cD9c7e': {
        tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        faucet: '0x0000000000000000000000000000000000000000',
        decimals: 6,
        token: 'USDC.e',
        permitName: 'USD Coin (Arb1)',
        is_pol: false,
      },
      '0xfD9f8841C471Fcc55f5c09B8ad868BdC9eDeBDE1': {
        tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        faucet: null,
        decimals: 6,
        token: 'USDC',
        is_pol: true,
      },
      '0xEe8f62C080A6da2B91ab3478D58e6999daAAb8be': {
        tokenAddress: '0x7Fe2dD3b4619802B8c4b404f5e440756391439ba',
        faucet: '0xB54521E255d23F2fA7f37d29C7E76D8FFa85fc05',
        decimals: 6,
        token: 'USDC',
        permitName: 'USDC',
        is_pol: false,
      },
      '0x70086DFD2b089359A6582A18D24aBE1AcE40f8D0': {
        tokenAddress: '0x9132016099CEbb740db64A36da0D3307824Ad159',
        faucet: '0x62Db9CD484b3B59e1d0444cea1f0D0D3c00bf2F5',
        decimals: 18,
        token: 'BFR',
        permitName: 'Token',
        is_pol: false,
      },
      '0xaE0628C88EC6C418B3F5C005f804E905f8123833': {
        tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        faucet: '0x6B655D99962F58B9Aa0fFB18281408CdBCf61800',
        decimals: 18,
        token: 'ARB',
        permitName: 'Arbitrum',
        is_pol: false,
      },
    },
  },
};
