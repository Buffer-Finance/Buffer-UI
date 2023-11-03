import { AllMyTab } from '@Views/NoLoss-V3/Components/AllMyTab';
import { TournamentStateTabs } from '@Views/NoLoss-V3/Components/TournamentStateTabs';
import { WinningPrizeModal } from '@Views/NoLoss-V3/Components/WinningPrizeModal';
import { useAllTournamentData } from '@Views/NoLoss-V3/Hooks/useAllTournamentdata';
import { useTournamentIds } from '@Views/NoLoss-V3/Hooks/useTournamentIds';
import styled from '@emotion/styled';
import { TournamentsList } from './TournamentsList';

export const Tournaments: React.FC = () => {
  useTournamentIds();
  useAllTournamentData();

  return (
    <TournamentsBackground>
      <WinningPrizeModal />
      <TournamentStateTabs />
      <AllMyTab />
      <TournamentsList />
    </TournamentsBackground>
  );
};

const TournamentsBackground = styled.div`
  padding: 0 6px;
`;
