export const poolToTokenMapping = {
  uBLP: 'USDC',
  aBLP: 'ARB',
};

export const lpConfig = {
  '421614': {
    USDC: '0x7Fe2dD3b4619802B8c4b404f5e440756391439ba',
    uBLP: '0xEe8f62C080A6da2B91ab3478D58e6999daAAb8be',
    RewardRouter: '0xa4BED1D57b4868B25716af264aC82d9d5262c928',
    nftLockPool: '0xd4bf543d10654e0Ef47AE606b963C214f6552E1A',
    feeBLPtracker: '0x4cdb37E0B33eb763918c6225CE81fcF788cd097E',
  },
};

export const getLpConfig = (chainId: string | number) => {
  try {
    return lpConfig[chainId as '421614'];
  } catch (e) {
    console.error(e);
    return lpConfig['421614'];
  }
};
