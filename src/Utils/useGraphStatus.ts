import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';

const useGraphStatus = () => {
  const { activeChain } = useActiveChain();
  const graphUrlMain = 'https://ponder.buffer.finance/status';
  const { data } = useSWR('graph-status', {
    fetcher: async () => {
      const mainQuery = await axios.get(graphUrlMain);
      const isError = mainQuery.data?.arbitrum.ready;
      return { error: isError };
    },
    refreshInterval: 5000,
  });
  return data;
};

export { useGraphStatus };
