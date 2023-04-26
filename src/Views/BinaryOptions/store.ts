import { atom } from 'jotai';
import { IMarket } from '.';

export interface IStatsData {
  underlying_asset: {
    address: string;
    img: string;
    name: string;
    full_name: string;
    current_price: number;
    '24_hour_change': string;
  };
  payout?: number;
  available_liquidity: string;
  is_favourite?: boolean;
  txn_tokens: TXNToken[];
  pair?: string;
}
export interface TXNToken {
  address: string;
  img: string;
  name: string;
  abi: any[];
  decimals: number;
}
export interface IBet {
  expiration: number;
  implied_probability: number;
  is_above: boolean;
  max_amount: number;
  odds: number;
  strike: number;
}

export interface IHistory {
  state:
    | 'active'
    | 'expired'
    | 'cancelled'
    | 'queued'
    | 'pending'
    | 'exercised';
  strike: number;
  normal_option: boolean;
  size: number;
  locked_amount: number;
  premium: number;
  total_fee: number;
  asset: IMarket;
  environment: string;
  option_id: number;
  user: string;
  txn_hash: string;
  contract_address: string;
  version: number;
  // is_yes: boolean;
  is_above: boolean;
  iv: number;
  is_new: boolean;
  deposit_token: string;
  txn_token: string;
  token2: string;
  is_queued: boolean;
  is_cancelled: boolean;
  slippage: number;
  price_at_expiry: number | null;
  tv_id: string;
  queue_id: number;
  expires_in: string;
  expiration: number;
  is_expired: boolean;
  placed_at: string;
  creation_date: number;
  profit: number;
  roi: number;
  payout: number;
  net_pnl: number;
  odds: number;
  implied_probability: number;
  is_payout_credited: boolean;

  // current: number;
  // contract_user_id: number;
}
export const isDrawerOpen = atom<boolean>(true);
export const Modal = atom<boolean>(false);
export const BetType = atom<boolean>(false);
export const Date = atom<number | null | string>(null);
export const SelectedBet = atom<null | number>(null);
export const DrawerState = atom<boolean>(true);

export const counter = atom<number>(2);
export const tab = atom<number>(0);
export const drawerType = atom<boolean>(true);
export const graph = atom<boolean>(false);
export const historyTab = atom<number>(0);
export const markets = atom<IStatsData[]>([]);
export const dates = atom([]);
