import { AllMyTab } from '@Views/NoLoss-V3/Components/AllMyTab';
import { TournamentStateTabs } from '@Views/NoLoss-V3/Components/TournamentStateTabs';
import { useTournamentDataFetch } from '@Views/NoLoss-V3/Hooks/useTournamentDataFetch';
import { useTournamentIds } from '@Views/NoLoss-V3/Hooks/useTournamentIds';
import styled from '@emotion/styled';
import { TournamentsList } from './TournamentsList';

export const Tournaments: React.FC = () => {
  useTournamentIds();
  useTournamentDataFetch();

  return (
    <TournamentsBackground>
      <TournamentStateTabs />
      <AllMyTab />
      <TournamentsList />
    </TournamentsBackground>
  );
};

const TournamentsBackground = styled.div`
  padding: 0 6px;
`;
