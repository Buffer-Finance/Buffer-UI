export type poolsType = 'uBLP' | 'aBLP';
export type transactionTabType = 'all' | 'my';
// export type depositTabType = 'deposit' | 'withdraw' | 'vest';
export type depositTabType = 'deposit' | 'withdraw';

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

export type blpPrice = {
  price: string;
  tokenXamount: string;
  blpAmount: string;
  poolName: string;
};
