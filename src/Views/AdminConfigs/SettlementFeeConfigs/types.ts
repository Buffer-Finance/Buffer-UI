export interface IMarketConstant {
  C: number;
  max_payout: number;
  initial_payout: number;
}

export interface IMarkets {
  [symbol: string]: IMarketConstant;
}

export interface IMarketConstantsResponse {
  id: number;
  environment: string;
  markets: IMarkets;
  start_time: number;
}
