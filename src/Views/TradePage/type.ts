//type of markets needed on trade page
export type marketType = {
  category: string;
  token0: string;
  token1: string;
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
