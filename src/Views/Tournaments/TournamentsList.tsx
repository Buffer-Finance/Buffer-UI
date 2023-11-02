import { TradepageTournamentCard } from '@Views/NoLoss-V3/Components/TradePageTournamentCard';
import { useTournamentDataFetch } from '@Views/NoLoss-V3/Hooks/useTournamentDataFetch';
import { filteredTournamentsDataReadOnlyAtom } from '@Views/NoLoss-V3/atoms';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';

export const TournamentsList: React.FC = () => {
  useTournamentDataFetch();
  const allTournaments = useAtomValue(filteredTournamentsDataReadOnlyAtom);

  if (allTournaments === undefined)
    return <Skeleton className="w-[100px] !h-8 lc " />;

  return (
    <div className="flex gap-3">
      {allTournaments.map((tournament) => (
        <TradepageTournamentCard
          tournament={tournament}
          key={tournament.id + tournament.tournamentMeta.name}
          isTradePage={false}
        />
      ))}
    </div>
  );
};
