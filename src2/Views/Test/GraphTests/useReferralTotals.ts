import { useEffect, useMemo, useState } from 'react';
import { IallReferralData, getAllReferralData } from './referralTotals';
export const useReferralTotals = (url: string) => {
  const [data, setData] = useState<IallReferralData[] | undefined>(undefined);
  console.log(data);

  useEffect(() => {
    if (data === undefined)
      getAllReferralData(url)
        .then((data) => setData(data))
        .catch((err) => console.log(err));
  }, []);

  const totalData = useMemo(() => {
    if (data === undefined) return undefined;
    return data.reduce(
      (acc, curr) => {
        const {
          totalDiscountAvailed,
          totalRebateEarned,
          totalTradesReferred,
          totalTradingVolume,
          totalVolumeOfReferredTrades,
        } = curr;
        acc.totalDiscountAvailed += +totalDiscountAvailed / 1e6;
        acc.totalRebateEarned += +totalRebateEarned / 1e6;
        acc.totalTradesReferred += totalTradesReferred;
        acc.totalTradingVolume += +totalTradingVolume / 1e6;
        acc.totalVolumeOfReferredTrades += +totalVolumeOfReferredTrades / 1e6;
        return acc;
      },
      {
        totalDiscountAvailed: 0,
        totalRebateEarned: 0,
        totalTradesReferred: 0,
        totalTradingVolume: 0,
        totalVolumeOfReferredTrades: 0,
      }
    );
  }, [data]);
  return { data, totalData };
};
