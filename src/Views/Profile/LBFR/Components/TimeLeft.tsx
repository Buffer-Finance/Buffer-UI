import { useActiveChain } from '@Hooks/useActiveChain';
import { useWeekOfTournament } from '@Views/V2-Leaderboard/Hooks/useWeekOfTournament';
import { LBFRconfig } from '../config';
import useStopWatch from '@Hooks/Utilities/useStopWatch';

export const TimeLeft = () => {
  const { activeChain } = useActiveChain();
  const { nextTimeStamp } = useWeekOfTournament({
    startTimestamp: LBFRconfig[activeChain.id]?.startTimestamp,
  });

  const stopwatch = useStopWatch(nextTimeStamp / 1000);
  return <>{stopwatch}</>;
};
