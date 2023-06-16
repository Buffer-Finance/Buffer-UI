import { appConfig, marketsForChart } from './config';

//type of markets needed on trade page
export type marketType = {
  category: string;
  token0: string;
  token1: string;
  tv_id: string;
  pair: string;
  price_precision: number;
  full_name: string;
  img: string;
  pythId: string;
  pools: {
    pool: string;
    max_fee: string;
    min_fee: string;
    max_duration: string;
    min_duration: string;
    isPaused: boolean;
    configContract: string;
    optionContract: string;
    openInterest: string;
    platformFee: string;
  }[];
};

//type of data returned from graphql
export type response = {
  optionContracts: responseObj[];
};
export type responseObj = {
  configContract: {
    address: string;
    maxFee: string;
    maxPeriod: string;
    minFee: string;
    minPeriod: string;
    platformFee: string;
  };
  address: string;
  poolContract: string;
  isPaused: boolean;
  category: number;
  asset: string;
  openInterest: string;
};

export enum AssetCategory {
  Forex,
  Crypto,
  Commodities,
}

export enum notificationPosition {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}

export enum tradePanelPosition {
  Left,
  Right,
}

export enum directionBtn {
  Up,
  Down,
}

export type configType = (typeof appConfig)['421613'];

export type poolInfoType =
  (typeof appConfig)['421613']['poolsInfo']['0xEbB1314A9549EE12F0FAA76B9E66e017b1De7dc5'];

export type chartDataType = (typeof marketsForChart)['BTCUSD'];
