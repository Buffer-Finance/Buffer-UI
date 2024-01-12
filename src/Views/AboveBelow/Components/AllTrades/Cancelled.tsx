import axios from 'axios';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Cancelled } from '../Tables/Cancelled';

import { useActiveChain } from '@Hooks/useActiveChain';
import { useProcessedTrades } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { cancelledActivePageAtom } from './atoms';

export const AllCancelled: React.FC<{}> = () => {
  const [activePage, setActivePage] = useAtom(cancelledActivePageAtom);
  const { activeChain } = useActiveChain();
  const { getProcessedTrades } = useProcessedTrades();

  const { data: totalCancelled } = useSWR(`total-cancelled`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(config.graph.MAIN, {
        query: `{
            cancelledLength: queuedOptionDatas(
                orderBy: queueID
                orderDirection: desc
                first: 10000
                where: {
                  state_in: [5],
                }
              ){
                  id
              }
          }`,
      });
      return response.data?.data.cancelledLength;
    },
  });

  const { data } = useSWR(`all-cancelled-${activePage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(config.graph.ABOVE_BELOW, {
        query: `{
            cancelledTrades: queuedOptionDatas(
                first: ${10}
                skip: ${(activePage - 1) * 10}
                orderBy: queueID
                orderDirection: desc
                where: {
                  state_in: [5],
                }
              ){
                isAbove
                queueID
                reason
                state
                strike
                queueTimestamp
                cancelTimestamp
                maxFeePerContract
                expirationTime
                numberOfContracts
                user
                optionContract {
                  token0
                  token1
                  address
                }
              }
            }`,
      });
      return response.data?.data.cancelledTrades;
    },
    refreshInterval: 1000,
  });
  // console.log(data);

  const cancelledTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);

  return (
    <Cancelled
      activePage={activePage}
      setCancelledPage={setActivePage}
      totalPages={totalCancelled ? Math.ceil(totalCancelled.length / 10) : 1}
      isLoading={false}
      cancelled={cancelledTrades ?? []}
      inGlobalContext
    />
  );
};
