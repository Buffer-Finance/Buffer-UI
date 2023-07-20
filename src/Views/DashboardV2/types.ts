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
  openInterest: string | null;
  total24hrsStats: total24hrsStatsType;
  totalStats: totalStatsType;
} | null;

export type total24hrsStatsType = { [key: string]: tokenX24hrsStats };

export type totalStatsType = { [key: string]: toalTokenXstats };

export type keyValueStringType = {
  [key: string]: string;
};
