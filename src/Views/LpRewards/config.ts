export const poolToTokenMapping = {
  uBLP: 'USDC.e',
  aBLP: 'ARB',
};

export const lpConfig = {
  '421614': {
    USDC: '0x4c989a68450d341c4562693057f328af98327ab4',
    uBLP: '0x175f6cf189e229b40dbBcC395d9325743D94EF37',
    RewardRouter: '0xDA3b0A88dB9314c6412f25689E395fDc6bB780bf',
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
