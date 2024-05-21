import { divide } from '@Utils/NumString/stringArithmatics';
import { toalTokenXstats } from '@Views/DashboardV2/types';

export const getTotalStats = (
  data: toalTokenXstats,
  decimals: number
): toalTokenXstats => {
  return {
    totalSettlementFees: divide(data.totalSettlementFees, decimals) as string,
    totalTrades: data.totalTrades,
    totalVolume: divide(data.totalVolume, decimals) as string,
    openInterest: divide(data.openInterest, decimals) as string,
  };
};
