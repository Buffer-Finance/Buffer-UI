import { chartDataType, poolInfoType } from '@Views/TradePage/type';

export interface responseAB {
  address: string;
  token0: string;
  token1: string;
  isPaused: boolean;
  poolContract: string;
  routerContract: string;
  openUp: string;
  openDown: string;
  openInterestUp: string;
  openInterestDown: string;
  pool: string;
  config: {
    address: string;
    minFee: string;
    creationWindowContract: string;
    circuitBreakerContract: string;
    optionStorageContract: string;
    platformFee: string;
    sfdContract: string;
    sf: string;
    traderNFTContract: string;
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
