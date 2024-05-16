export const poolToTokenMapping = {
  uBLP: 'USDC',
  aBLP: 'ARB',
};

export const lpConfig = {
  '421614': {
    USDC: '0x7Fe2dD3b4619802B8c4b404f5e440756391439ba',
    uBLP: '0xEe8f62C080A6da2B91ab3478D58e6999daAAb8be',
    RewardRouter: '0x6833f1d342efDFeEb44eD9830c1b4F5A06292e51',
    nftLockPool: '0x48354099b3cF94c7dF28225aebb79257f4E81b04',
    feeBLPtracker: '0xaF720639191E5f4Ab220e61Af2Cf07995D52d805',
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
