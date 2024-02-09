import { useToast } from '@Contexts/Toast';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { activeChainAtom, nolossmarketsAtom } from '../atoms';
import { marketsForChart } from '../config';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { InoLossMarketResponse } from '../types';

export const useNoLossMarkets = () => {
  const activeChain = useAtomValue(activeChainAtom);

  const toastify = useToast();
  const setMarkets = useSetAtom(nolossmarketsAtom);

  const query = `{
        optionContracts {
            address
            asset
            isPaused
            payoutForUp
            payoutForDown
            config {
              address
              minFee
              maxFee
              minPeriod
              maxPeriod
              creationWindowContract
            }
          }
    }`;

  async function fetchData() {
    try {
      if (!activeChain) throw new Error('activeChain not found');

      const config = getNoLossV3Config(activeChain.id);

      const { data, status } = await axios.post<{
        data: { optionContracts: InoLossMarketResponse[] };
      }>(config.graph, { query });
      if (status !== 200) throw new Error('Error fetching tournament ids');
      const markets = data.data.optionContracts.map((market) => {
        return {
          ...market,
          chartData:
            marketsForChart[market.asset as keyof typeof marketsForChart],
        };
      });
      setMarkets(markets);
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'fetch-tournament',
      });
    }
  }

  useSWR(`fetch-no-loss-markets-${activeChain?.id}`, {
    fetcher: fetchData,
    refreshInterval: 10000,
  });
};
