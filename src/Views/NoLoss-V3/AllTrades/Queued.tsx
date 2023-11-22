import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useProcessedTrades } from '../Hooks/usePastTradeQuery';
import { Queued } from '../Tables/Queued';
import { activeChainAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { queuedActivePageAtom } from './atoms';

export const AllQueued = () => {
  const [queuedPage, setQueuedPage] = useAtom(queuedActivePageAtom);
  const activeChain = useAtomValue(activeChainAtom);
  const { getProcessedTrades } = useProcessedTrades();

  const { data: totalQueued } = useSWR(`total-queued`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getNoLossV3Config(activeChain?.id);
      const response = await axios.post(config.graph, {
        query: `{
            queuedLength: queuedOptionDatas(
                orderBy: queueID
                orderDirection: desc
                first: 10000
                where: {
                  state_in: [4],
                }
              ){
                  id
              }
            }`,
      });
      return response.data?.data.queuedLength;
    },
  });

  const { data } = useSWR(`all-queued-${queuedPage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getNoLossV3Config(activeChain?.id);
      const response = await axios.post(config.graph, {
        query: `{
            queuedTrades: queuedOptionDatas(
                orderBy: queueID
                orderDirection: desc
                where: {
                  state_in: [4],
                }
              ){
                  queueTimestamp
                  isAbove
                  queueID
                  state
                  slippage
                  strike
                  totalFee
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
      return response.data?.data.queuedTrades;
    },
    refreshInterval: 1000,
  });

  const queuedTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);

  return (
    <Queued
      queuedPage={queuedPage}
      setQueuedPage={setQueuedPage}
      totalPages={totalQueued ? Math.ceil(totalQueued.length / 10) : 1}
      isLoading={false}
      queued={queuedTrades ?? []}
      inGlobalContext
    />
  );
};
