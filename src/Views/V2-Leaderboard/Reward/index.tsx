import { LeaderBoard } from '..';
import { DailyStyles } from '../Daily/stlye';

export const Reward = () => {
  return (
    <LeaderBoard
      children={
        <DailyStyles>
          <div>reward</div>
        </DailyStyles>
      }
    />
  );
};
