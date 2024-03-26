import {
  arbitrumOverview,
  toalTokenXstats,
  tokenX24hrsStats,
} from '@Views/DashboardV2/types';
import { useDecimalsByAsset } from '@Views/ABTradePage/Hooks/useDecimalsByAsset';
import { useMemo } from 'react';
import { get24hrsStats } from './get24hrsStats';
import { getTotalStats } from './getTotalStats';
import { useGraphqlRequest } from './useGraphqlRequest';

export const useArbitrumOverview = () => {
  const { data, error } = useGraphqlRequest();
  const decimalsByName = useDecimalsByAsset();

  const stats = useMemo(() => {
    const returnObj: {
      total24hrsStats: { [key: string]: tokenX24hrsStats };
      totalStats: { [key: string]: toalTokenXstats };
    } = {
      total24hrsStats: {},
      totalStats: {},
    };

    if (data !== undefined && data !== null && !error) {
      for (let [key, value] of Object.entries(data)) {
        if (value && !key.includes('24') && key.includes('stats')) {
          const decimals = decimalsByName[key.split('stats')[0]] ?? 6;
          returnObj['totalStats'][key] = getTotalStats(
            value as toalTokenXstats,
            decimals
          );
        }

        if (value && key.includes('24')) {
          const decimals = decimalsByName[key.split('24')[0]] ?? 6;
          returnObj['total24hrsStats'][key] = get24hrsStats(
            value as tokenX24hrsStats[],
            decimals
          );
        }
      }
    }

    return returnObj;
  }, [data]);

  const overView: arbitrumOverview = useMemo(() => {
    if (!data) return null;
    return {
      totalTraders: data.totalTraders[0]?.uniqueCountCumulative || 0,
      ...stats,
    };
  }, [data, stats]);

  return {
    overView,
  };
};
