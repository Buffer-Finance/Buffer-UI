import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useProcessedTrades } from '../Hooks/usePastTradeQuery';
import { Active } from '../Tables/Active';
import { activeChainAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { activeActivePageAtom } from './atoms';

export const AllActive = () => {
  const [activePage, setActivePage] = useAtom(activeActivePageAtom);
  const activeChain = useAtomValue(activeChainAtom);
  const { getProcessedTrades } = useProcessedTrades();

  const { data: totalActive } = useSWR(`total-active`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getNoLossV3Config(activeChain?.id);
      const response = await axios.post(config.graph, {
        query: `{
            activeLength: userOptionDatas(
                orderBy: creationTime
                orderDirection: desc
                where: {
                  state_in: [1],
                  expirationTime_gt: ${Math.floor(Date.now() / 1000)}
                }
              ){  
                  id
              }
            }`,
      });
      return response.data?.data.activeLength;
    },
  });

  const { data } = useSWR(`all-active-${activePage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getNoLossV3Config(activeChain?.id);
      const response = await axios.post(config.graph, {
        query: `{
            activeTrades: userOptionDatas(
                orderBy: creationTime
                orderDirection: desc
                first: ${10}
                skip: ${(activePage - 1) * 10}
                where: {
                  state_in: [1],
                  expirationTime_gt: ${Math.floor(Date.now() / 1000)}
                }
              ){
                  amount
                  creationTime
                  expirationPrice
                  expirationTime
                  isAbove
                  payout
                  queueID
                  optionID
                  state
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
      return response.data?.data.activeTrades;
    },
    refreshInterval: 1000,
  });
  console.log(data);

  const activeTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);

  return (
    <Active
      activePage={activePage}
      setActivePage={setActivePage}
      totalPages={totalActive ? Math.ceil(totalActive.length / 10) : 1}
      isLoading={false}
      active={activeTrades ?? []}
      inGlobalContext
    />
  );
};
