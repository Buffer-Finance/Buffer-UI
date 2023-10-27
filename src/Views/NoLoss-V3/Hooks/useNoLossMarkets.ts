import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import useSWR from 'swr';
import { nolossmarketsAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

export const useNoLossMarkets = () => {
  const { activeChain } = useActiveChain();
  const toastify = useToast();
  const setMarkets = useSetAtom(nolossmarketsAtom);

  const query = `{
        optionContracts {
            address
            asset
            isPaused
            config {
              address
              minFee
              maxFee
              minPeriod
              maxPeriod
            }
          }
    }`;

  async function fetchData() {
    try {
      const config = getNoLossV3Config(activeChain.id);

      const { data, status } = await axios.post(config.graph, { query });
      if (status !== 200) throw new Error('Error fetching tournament ids');
      setMarkets(data.data.optionContracts);
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'fetch-tournament',
      });
    }
  }

  useSWR('fetch-no-loss-markets', {
    fetcher: fetchData,
    refreshInterval: 10000,
  });
};
