import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import useSWR from 'swr';
import { tournamentIdsAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

export const useTournamentIds = () => {
  const { activeChain } = useActiveChain();
  const toastify = useToast();
  const setTournamentIds = useSetAtom(tournamentIdsAtom);
  const query = `{
        tournaments {
            id
            state
          }
    }`;

  async function fetchData() {
    try {
      const config = getNoLossV3Config(activeChain.id);

      const { data, status } = await axios.post(config.graph, { query });
      if (status !== 200) throw new Error('Error fetching tournament ids');
      setTournamentIds(data.data.tournaments);
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
