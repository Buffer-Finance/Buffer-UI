import { useToast } from '@Contexts/Toast';
import axios from 'axios';
import { isTestnet } from 'config';
import useSWR from 'swr';
import { activeChainSignal, tournamentIdsSignal } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

export const useTournamentIds = () => {
  const activeChain = activeChainSignal.value;
  const toastify = useToast();
  const query = isTestnet
    ? `{
    tournaments(where: {id_not: "16"}) {
      id
      state
    }
    }`
    : `{
      tournaments {
        id
        state
      }
      
    }`;

  async function fetchData() {
    try {
      if (!activeChain) throw new Error('activeChain not found');
      const config = getNoLossV3Config(activeChain.id);

      const { data, status } = await axios.post(config.graph, { query });
      if (status !== 200) throw new Error('Error fetching tournament ids');
      tournamentIdsSignal.value = data.data.tournaments;
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'fetch-tournament',
      });
    }
  }

  useSWR('fetch-tournament-ids', {
    fetcher: fetchData,
    refreshInterval: 10000,
  });
};
