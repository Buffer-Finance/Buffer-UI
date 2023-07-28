import { appConfig, marketsForChart } from './config';
export type poolType = {
  pool: string;
  max_fee: string;
  min_fee: string;
  max_duration: string;
  min_duration: string;
  isPaused: boolean;
  configContract: string;
  optionContract: string;
  platformFee: string;
  earlyclose: {
    enable: boolean;
    threshold: string;
  };
};
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
  pools: poolType[];
};

export interface TradeType {
  id: number;
  canellation_reason: string | null;
  cancellation_timestamp: number | null;
  signature_timestamp: number;
  queued_timestamp: number;
  queue_id: number;
  strike: number;
  period: number;
  target_contract: string;
  expiry_price: number | null;
  payout: number | null;
  user_partial_signature: string;
  open_timestamp: number;
  close_time: number;
  user_full_signature: string;
  user_address: string;
  trade_size: number;
  locked_amount: number;
  allow_partial_fill: boolean;
  referral_code: string;
  trader_nft_id: number;
  slippage: number;
  settlement_fee: number;
  settlement_fee_sign_expiration: number;
  settlement_fee_signature: string;
  expiration_time: null | number;
  is_above: boolean;
  state: 'QUEUED' | 'OPENED' | 'CLOSED';
  option_id: null | number;
  is_limit_order: boolean;
  limit_order_expiration: 0 | number;
  limit_order_duration: 0 | number;
  environment: '421613' | '42161';
  market: marketType;
  pool: poolType;
}
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
    earlyCloseThreshold: string;
    isEarlyCloseEnabled: boolean;
  };
  address: string;
  poolContract: string;
  isPaused: boolean;
  category: number;
  asset: string;
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
  (typeof appConfig)['421613']['poolsInfo']['0x55Ded741F9c097A95F117a08334D1fBb70A5B05D'];

export type chartDataType = (typeof marketsForChart)['BTCUSD'];

export type tradesApiResponseType = {
  page_data: TradeType[];
  total_pages: number;
};
