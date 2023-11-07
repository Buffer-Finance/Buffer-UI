import { RowBetween } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { useTournamentDataFetch } from '../Hooks/useTournamentDataFetch';
import { filteredTournamentsDataReadOnlyAtom } from '../atoms';
import { AllMyTab } from './AllMyTab';
import { TournamentStateTabs } from './TournamentStateTabs';
import { TradepageTournamentCard } from './TradePageTournamentCard';

const TradePageNoLossBackground = styled.div`
  position: sticky;
  top: 45px;
  margin: 0 6px;
  width: 300px;
  height: calc(100vh - 80px);
`;

export const NoLossSection: React.FC<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  const navigate = useNavigate();
  useTournamentDataFetch();
  return (
    <TradePageNoLossBackground>
      <RowBetween>
        <TournamentStateTabs />
        {/* <IconButton
          onClick={() => {
            navigate('/tournaments');
          }}
          className="!p-[0]"
        >
          <BackIcon />
        </IconButton> */}
      </RowBetween>
      <AllMyTab />
      <NoLoss isMobile={isMobile} />
    </TradePageNoLossBackground>
  );
};

const NoLoss: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const allTournaments = useAtomValue(filteredTournamentsDataReadOnlyAtom);
  if (allTournaments === undefined)
    return <Skeleton className="w-[250px] !h-[200px] lc !transform-none" />;

  return (
    <TournamentListWrapper>
      {allTournaments.map((tournament) => (
        <TradepageTournamentCard
          isMobile={isMobile}
          tournament={tournament}
          key={tournament.id + tournament.tournamentMeta.name}
        />
      ))}
    </TournamentListWrapper>
  );
};

const TournamentListWrapper = styled.div`
  height: 100%;
  padding: 0 0 48px 0;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 2px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 24px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
  }
`;
