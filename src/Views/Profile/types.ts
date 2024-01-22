import { chartDataType, poolInfoType } from '@Views/TradePage/type';

export interface responseAB {
  address: string;
  token1: string;
  token0: string;
  isPaused: boolean;
  routerContract: string;
  poolContract: string;
  openUp: string;
  openDown: string;
  openInterestUp: string;
  openInterestDown: string;
  config: {
    address: string;
    maxSkew: string;
    circuitBreakerContract: string;
    traderNFTContract: string;
    sf: string;
    sfdContract: string;
    payout: string;
    platformFee: string;
    optionStorageContract: string;
    stepSize: string;
  };
}

export interface marketTypeAB
  extends Exclude<responseAB, 'token1' & 'token0'>,
    chartDataType {
  poolInfo: poolInfoType;
}
