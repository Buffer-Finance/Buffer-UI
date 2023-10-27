import { useAtomValue } from 'jotai';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { tournamentIdsAtom } from './atoms';

export const NoLossV3 = () => {
  const tournamentIds = useAtomValue(tournamentIdsAtom);
  console.log(tournamentIds);
  useTournamentIds();
  return <>NoLoss</>;
};
