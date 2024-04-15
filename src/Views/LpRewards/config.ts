export const poolToTokenMapping = {
  uBLP: 'USDC',
  aBLP: 'ARB',
};

export const lpConfig = {
  '421614': {
    USDC: '0x6ad6AdA23d61aA3f101ebEd842A378aB890C00a2',
    uBLP: '0x55413f709f155DC9bC471a182B3646618FdB394e',
    RewardRouter: '0x3aE74730660611E957FB118b96992c5613eF2849',
    nftLockPool: '0x620032e5741C2760B2E7D2d39763adeD43EBe560',
    feeBLPtracker: '0xb9fd2416810c1Bf550156406B624916E48A1c1B0',
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
