import { useToast } from '@Contexts/Toast';
import axios from 'axios';
import { isTestnet } from 'config';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import useSWR from 'swr';
import { activeChainAtom, tournamentIdsAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

export const useTournamentIds = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const toastify = useToast();
  const setTournamentIds = useSetAtom(tournamentIdsAtom);
  const query = isTestnet
    ? `{
    tournaments {
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
      return data.data.tournaments;
      // setTournamentIds(data.data.tournaments);
    } catch (e) {
      // setTournamentIds(undefined);
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'fetch-tournament',
      });
    }
  }

  const { data } = useSWR(`fetch-tournament-ids-${activeChain?.id}`, {
    fetcher: fetchData,
    refreshInterval: 10000,
  });

  useEffect(() => {
    console.log('Tournamentdata', data);
    setTournamentIds(data);
  }, [data]);
};
