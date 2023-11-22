import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useProcessedTrades } from '../Hooks/usePastTradeQuery';
import { Cancelled } from '../Tables/Cancelled';
import { activeChainAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { cancelledActivePageAtom } from './atoms';

export const AllCancelled: React.FC<{}> = () => {
  const [activePage, setActivePage] = useAtom(cancelledActivePageAtom);
  const activeChain = useAtomValue(activeChainAtom);
  const { getProcessedTrades } = useProcessedTrades();

  const { data: totalCancelled } = useSWR(`total-cancelled`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getNoLossV3Config(activeChain?.id);
      const response = await axios.post(config.graph, {
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
      const config = getNoLossV3Config(activeChain?.id);
      const response = await axios.post(config.graph, {
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
                  slippage
                  strike
                  totalFee
                  queueTimestamp
                  cancelTimestamp
                  user
                  optionContract {
                    asset
                    address
                  }
                  tournament {
                    id
                  }
              }
            }`,
      });
      return response.data?.data.cancelledTrades;
    },
    refreshInterval: 1000,
  });
  console.log(data);

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
