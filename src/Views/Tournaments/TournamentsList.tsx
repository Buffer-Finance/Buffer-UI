import { TradepageTournamentCard } from '@Views/NoLoss-V3/Components/TradePageTournamentCard';
import { useTournamentDataFetch } from '@Views/NoLoss-V3/Hooks/useTournamentDataFetch';
import { filteredTournamentsDataReadOnlyAtom } from '@Views/NoLoss-V3/atoms';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMedia } from 'react-use';

export const TournamentsList: React.FC = () => {
  useTournamentDataFetch();
  const allTournaments = useAtomValue(filteredTournamentsDataReadOnlyAtom);
  const isNotMobile = useMedia('(min-width:1200px)');

  if (allTournaments === undefined)
    return <Skeleton className="w-[100px] !h-8 lc " />;

  return (
    <div className={`flex gap-3 ${!isNotMobile ? 'flex-col' : ''}`}>
      {allTournaments.map((tournament) => (
        <TradepageTournamentCard
          isMobile={!isNotMobile}
          tournament={tournament}
          key={tournament.id + tournament.tournamentMeta.name}
          isTradePage={false}
        />
      ))}
    </div>
  );
};
