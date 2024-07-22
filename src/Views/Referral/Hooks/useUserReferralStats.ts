import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';

function getTokenXQueryFields(token: string) {
  const fields = [
    'totalTradesReferred',
    'totalVolumeOfReferredTrades',
    'totalRebateEarned',
    'totalTradingVolume',
    'totalDiscountAvailed',
  ];
  return fields.map((field) => field + token).join(' ');
}

export const useUserReferralStats = () => {
  const { address } = useUserAccount();
  const poolNames = usePoolNames();
  const tokens = useMemo(
    () =>
      poolNames.filter(
        (pool) =>
          !pool.toLowerCase().includes('pol') &&
          !pool.toLowerCase().includes('.e')
      ),
    [poolNames]
  );
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const graphUrl = 'http://ponder.buffer.finance/';
  const queryFields = useMemo(() => {
    if (tokens.length > 1)
      return tokens.map((poolName) => getTokenXQueryFields(poolName)).join(' ');
    else return '';
  }, [tokens]);

  return useSWR(`${address}-referral-stats`, {
    fetcher: async () => {
      const response = await axios.post(graphUrl, {
        query: `{
              referralDatas (where: { user: "${address}"} ) {
                items{
                totalTradesReferred
                totalVolumeOfReferredTrades
                totalRebateEarned
                totalTradingVolume
                totalDiscountAvailed
                ${queryFields}
                }
              }
            }
            `,
      });
      return (
        response.data?.data?.referralDatas.items?.[0] || {
          totalTradesReferred: '0',
          totalVolumeOfReferredTrades: '0',
          totalRebateEarned: '0',
          totalTradingVolume: '0',
          totalDiscountAvailed: '0',
        }
      );
    },
    refreshInterval: 400,
  });
};
