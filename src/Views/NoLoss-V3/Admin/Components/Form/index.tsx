import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { LeaderboardRules } from './LeaderboardRules';
import { TournamentConditions } from './TournamentConditions';
import { TournamentMeta } from './TournamentMeta';

export const Form: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <HorizontalTransition value={currentStep}>
      <TournamentMeta />
      <TournamentConditions />
      <LeaderboardRules />
    </HorizontalTransition>
  );
};
