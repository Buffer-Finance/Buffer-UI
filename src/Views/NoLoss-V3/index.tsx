import { useAtomValue } from 'jotai';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { useNoLossMarkets } from './Hooks/usenoLossMarkets';
import { nolossmarketsAtom, tournamentIdsAtom } from './atoms';

export const NoLossV3 = () => {
  const tournamentIds = useAtomValue(tournamentIdsAtom);
  useTournamentIds();
  const markets = useAtomValue(nolossmarketsAtom);
  useNoLossMarkets();
  return <>NoLoss</>;
};
