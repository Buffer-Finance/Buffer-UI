export type tokenX24hrsStats = {
  amount: string;
  settlementFee: string;
};

export type toalTokenXstats = {
  totalSettlementFees: string;
  totalVolume: string;
  totalTrades: number;
};

export type responseType = {
  totalTraders: [{ uniqueCountCumulative: number }];
};

export type totalStats = {
  [key: string]: tokenX24hrsStats[] | toalTokenXstats;
};

export type arbitrumOverview = {
  totalTraders: number;
  total24hrsStats: total24hrsStatsType;
  totalStats: totalStatsType;
} | null;

export type total24hrsStatsType = { [key: string]: tokenX24hrsStats };

export type totalStatsType = { [key: string]: toalTokenXstats };

export type keyValueStringType = {
  [key: string]: string;
};

export type otherChainsOverviewType = {
  USDCfees: string;
  USDCvolume: string;
  avgTrade: string;
  totalTraders: number;
  usdc_24_fees: string;
  usdc_24_volume: string;
  trades: number;
  // openInterest: number;
};

export type otherBlpType = {
  price: string | null;
  supply: string | null;
  total_usdc: string | null;
  usdc_pol: string | null;
  usdc_total: string | null;
} | null;
