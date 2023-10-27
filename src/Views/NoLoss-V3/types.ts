import { config } from './config';

export interface ItournamentId {
  id: string;
  state: string;
}

export type noLossConfigType = (typeof config)['421613'];

export interface InoLossConfigContract {
  address: string;
  minFee: string;
  maxFee: string;
  minPeriod: string;
  maxPeriod: string;
}

export interface InoLossMarket {
  address: string;
  asset: string;
  isPaused: boolean;
  config: InoLossConfigContract;
}
