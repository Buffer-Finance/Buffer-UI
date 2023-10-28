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

export interface IreadCall {
  address: string;
  abi: any;
  name: string;
  params: any[];
}

export interface TournamentMeta {
  name: string;
  start: string;
  close: string;
  ticketCost: string;
  playTokenMintAmount: string;
  isClosed: boolean;
  isVerified: boolean;
  tradingStarted: boolean;
  shouldRefundTickets: boolean;
  tournamentType: number;
  buyinToken: string;
  rewardToken: string;
  creator: string;
}

export interface TournamentConditions {
  maxBuyinsPerWallet: string;
  minParticipants: string;
  maxParticipants: string;
  guaranteedWinningAmount: string;
  startPriceMoney: string;
  rakePercent: string;
}

export interface ItournamentData {
  tournamentMeta: TournamentMeta;
  tournamentConditions: TournamentConditions;
  buyinTokenSymbol: string;
  buyinTokenDecimals: number;
  rewardTokenSymbol: string;
  rewardTokenDecimals: number;
  id: number;
  state: string;
  rewardPool: string;
}
