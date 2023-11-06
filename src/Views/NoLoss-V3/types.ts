import { config, marketsForChart } from './config';

export interface ItournamentId {
  id: string;
  state: string;
}

export type noLossConfigType = (typeof config)['421613'];
export type marketsForChartType = (typeof marketsForChart)['ARBUSD'];
export interface InoLossConfigContract {
  address: string;
  minFee: string;
  maxFee: string;
  minPeriod: string;
  maxPeriod: string;
}

export interface InoLossMarketResponse {
  address: string;
  asset: string;
  isPaused: boolean;
  config: InoLossConfigContract;
  payoutForUp: string;
  payoutForDown: string;
}

export interface InoLossMarket extends InoLossMarketResponse {
  chartData: marketsForChartType;
}

export interface IreadCall {
  address: string;
  abi: any;
  name: string;
  params: any[];
  id: string;
}

export interface TournamentMeta {
  buyinToken: string;
  close: string;
  creator: string;
  isClosed: boolean;
  isVerified: boolean;
  name: string;
  playTokenMintAmount: string;
  rewardToken: string;
  shouldRefundTickets: boolean;
  start: string;
  ticketCost: string;
  tournamentType: number;
  tradingStarted: boolean;
}

export interface TournamentConditions {
  guaranteedWinningAmount: string;
  maxBuyinsPerWallet: string;
  maxParticipants: string;
  minParticipants: string;
  rakePercent: string;
  startPriceMoney: string;
}

export interface TournamentLeaderboard {
  rakeCollected: string;
  rankFirst: string;
  rankLast: string;
  rewardPercentages: string[];
  totalBuyins: string;
  totalWinners: string;
  userCount: string;
}
export interface ItournamentData {
  buyinTokenDecimals: number;
  buyinTokenSymbol: string;
  id: number;
  isUserEligible: boolean;
  hasUserClaimed: boolean;
  rewardTokenDecimals: number;
  rewardTokenSymbol: string;
  state: string;
  tournamentConditions: TournamentConditions;
  tournamentLeaderboard: TournamentLeaderboard;
  tournamentMeta: TournamentMeta;
  tournamentRewardPools: string;
}

export type accordianTableType = 'leaderboard' | 'history' | 'cancelled';

export interface ItournamentStats {
  rankFirst: string;
  rankLast: string;
  userCount: string;
  totalBuyins: string;
  rakeCollected: string;
  totalWinners: string;
}

export interface LeaderboardData {
  rank: string;
  stats: Stats;
  rebuys: string;
}

export interface Stats {
  next: string;
  previous: string;
  user: string;
  score: string;
  trades: string;
  netPnl: string;
  totalFee: string;
  hasClaimed: boolean;
  exists: boolean;
}
