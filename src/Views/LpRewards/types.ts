export type poolsType = 'uBLP' | 'aBLP';
export type transactionTabType = 'all' | 'my';
// export type depositTabType = 'deposit' | 'withdraw' | 'vest';
export type depositTabType = 'deposit' | 'withdraw';
export type graphsType = 'price' | 'tvl' | 'apr' | 'pnl';

export type poolTxn = {
  userAddress: string;
  timestamp: string;
  amount: string;
  lockPeriod: string;
  type: string;
  blpRate: string;
  unitsMinted: string;
  txnHash: string;
  poolName: 'USDC' | 'ARB';
};

export type lockTxn = {
  userAddress: string;
  timestamp: string;
  amount: string;
  lockPeriod: string;
  txnHash: string;
  poolName: string;
  nftId: string;
};

export type blpPrice = {
  price: string;
  tokenXamount: string;
  blpAmount: string;
  poolName: string;
};

export type poolStats = {
  profit: string;
  loss: string;
  timestamp: string;
};

export type tokensPerInterval = {
  usdcPerInterval: {
    amount: string;
  }[];
  lockPerInterval: {
    amount: string;
  }[];
  lockMultiplierSettings: {
    maxLockDuration: string;
    maxLockMultiplier: string;
  }[];
};
