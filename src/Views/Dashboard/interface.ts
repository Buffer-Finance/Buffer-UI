export interface IBFR {
  price: string;
  supply: string;
  total_staked: string;
  market_cap: string;
  circulatingSupply?: string;
  liquidity_pools_token: string;
}

export interface IBLP
  extends Omit<IBFR, 'liquidity_pools_token' | 'total_staked'> {
  apr: string;
  total_usdc: string;
  usdc_pol: string | null;
  usdc_total: string;
}
export interface IOverview {
  USDCfees: string | null;
  BFRfees: string | null;
  USDCvolume: string | null;
  BFRvolume: string | null;
  avgTrade: string | null;
  totalTraders: number;
  usdc_24_fees: string | null;
  usdc_24_volume: string | null;
  trades: number | null;
  openInterest: number | null;
}

export interface ITotalStats {
  USDCfees: string;
  USDCvolume: string;
  BFRfees: string;
  BFRvolume: string;
  totalTraders: number;
  avgTrade: string;
  usdc_24_fees: string;
  usdc_24_volume: string;
  trades: number | null;
  openInterest: number | null;
}
