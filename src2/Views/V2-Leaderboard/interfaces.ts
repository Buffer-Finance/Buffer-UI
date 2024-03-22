export interface IPerformer {
  option_count: number;
  deposit_token: string;
  chain_name: string;
  chain_image: string;
  pnl: number;
  user_address: string;
  user_image: string;
  net_pnl: number;
  rank: number;
  net_percentage_pnl: number | string;
  total_net_pnl: number;
  net_total_fee: number;
  volume: number;
  score: number;
}
export interface ILeague {
  user: string;
  totalTrades: number;
  id: string;
  netPnL: string;
  volume: string;
  [key: string]: string | number;
}
