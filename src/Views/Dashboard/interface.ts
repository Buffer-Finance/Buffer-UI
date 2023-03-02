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
  price: string;
  usdc_vault: string;
  bfr_vault: string;
  bfr_pol: string;
  usdc_pol: string;
  bfr_total: string;
  usdc_total: string;
  usdc_24_volume: string;
  bfr_24_volume: string;
  usdc_24_fees: string;
  bfr_24_fees: string;
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
}
