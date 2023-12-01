import { chartDataType, poolInfoType } from '@Views/TradePage/type';

export interface responseAB {
  address: string;
  token1: string;
  token0: string;
  isPaused: boolean;
  routerContract: string;
  poolContract: string;
  config: {
    address: string;
    maxSkew: string;
    creationWindowContract: string;
    circuitBreakerContract: string;
    iv: string;
    traderNFTContract: string;
    sf: string;
    sfdContract: string;
    payout: string;
    platformFee: string;
    optionStorageContract: string;
    ivFactorITM: string;
    ivFactorOTM: string;
  };
}

export interface marketTypeAB
  extends Exclude<responseAB, 'token1' & 'token0'>,
    chartDataType {
  poolInfo: poolInfoType;
}

export type accordianTableType = 'active' | 'history' | 'cancelled';
