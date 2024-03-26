import { chartDataType, poolInfoType } from '@Views/ABTradePage/type';

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
    creationWindowContract: string;
    circuitBreakerContract: string;
    iv: string;
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

export type accordianTableType =
  | 'active'
  | 'history'
  | 'cancelled'
  | 'platform_active'
  | 'platform_history';

export interface IreadCallData {
  balances: {
    [tokenName: string]: string;
  };
  allowances: {
    [tokenName: string]: string;
  };
  isInCreationWindow: {
    [category: string]: boolean;
  };
  maxPermissibleContracts: {
    [contractAddressstrike: string]: {
      isAbove: boolean;
      maxPermissibleContracts: string | undefined;
      strike: string;
    };
  };
}
