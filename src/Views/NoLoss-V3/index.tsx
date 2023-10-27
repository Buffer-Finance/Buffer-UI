import { useAtomValue } from 'jotai';
import { useNoLossMarkets } from './Hooks/useNoLossMarkets';
import { useTournamentDataFetch } from './Hooks/useTournamentDataFetch';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { nolossmarketsAtom, tournamentIdsAtom } from './atoms';

export const NoLossV3 = () => {
  const tournamentIds = useAtomValue(tournamentIdsAtom);
  useTournamentIds();
  const markets = useAtomValue(nolossmarketsAtom);
  useNoLossMarkets();
  useTournamentDataFetch();

  return <>NoLoss</>;
};
