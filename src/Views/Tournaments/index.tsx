import { AllMyTab } from '@Views/NoLoss-V3/Components/AllMyTab';
import { TournamentsPageBGImage } from '@Views/NoLoss-V3/Components/SVGs/TournamentsPageBGImage';
import { TournamentStateTabs } from '@Views/NoLoss-V3/Components/TournamentStateTabs';
import { useAllTournamentData } from '@Views/NoLoss-V3/Hooks/useAllTournamentdata';
import { useTournamentIds } from '@Views/NoLoss-V3/Hooks/useTournamentIds';
import styled from '@emotion/styled';
import { TournamentsList } from './TournamentsList';

export const Tournaments: React.FC = () => {
  useTournamentIds();
  useAllTournamentData();

  return (
    <TournamentsBackground>
      <TournamentsPageBGImage className="fixed bottom-[0] right-[0]" />
      {/* <WinningPrizeModal /> */}
      <TournamentStateTabs />
      <AllMyTab />
      <TournamentsList />
    </TournamentsBackground>
  );
};

const TournamentsBackground = styled.div`
  padding: 0 6px;
`;
