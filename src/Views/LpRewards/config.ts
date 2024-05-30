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
  '42161': {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    uBLP: '0x9501a00d7d4BC7558196B2e4d61c0ec5D16dEfb2',
    RewardRouter: '0xfd01f94a0fa92374ed4a9c28000Db5a7814FF11b',
    nftLockPool: '0xC428617D64b6609eF4265a2104eAa09202dB5160',
    feeBLPtracker: '0xb4e4fA0Ba9333b6a72cCd2F758a0600606B0E0E3',
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
