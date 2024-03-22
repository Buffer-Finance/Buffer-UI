import { LibrarySymbolInfo, ResolutionString, SubscribeBarsCallback } from '@Public/static/charting_library/charting_library';
import Config from 'public/config.json';
export type Markets = keyof typeof Config.markets;
export type WSUpdate =  {
  time: number;
  price: string;
  volume?:number;
}
export type Market2Prices = {
  [key in keyof typeof Config.markets]:WSUpdate[];
};


export interface LatestPriceApi  {
    p: number;
    '24h_change'?:number;
  }
export type Market2Prices3priceApi = {
  [key in keyof typeof Config.markets]: LatestPriceApi
};
type timestampObj = {
  timestamp:number;
}
export type  LatestPriceApiRes = Market2Prices3priceApi & timestampObj
export interface OHLCBlock {
        close: number;
        high: number;
        low: number;
        open: number;
        volume?:number;
        time: number;
        '24h_change'?: number;
      }
export type Market2Kline = {
  [key in keyof typeof Config.markets]:OHLCBlock
}

export interface RealtimeUpdate {
  symbolInfo?:LibrarySymbolInfo;
  resolution: ResolutionString;
  onRealtimeCallback: SubscribeBarsCallback;
  onResetCacheNeededCallback: () => void;
}