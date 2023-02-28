import { useActiveChain } from '@Hooks/useActiveChain';
import { startTimestamp } from '../Weekly/config';

const MSINWEEK = 604800000;

export const useWeekOfTournament = () => {
  const { activeChain } = useActiveChain();
  const currentTimeStamp = new Date().getTime();
  const start = startTimestamp[activeChain.id];

  if (start === undefined) {
    return { week: null, nextTimeStamp: null };
  }
  return {
    week: Math.floor((currentTimeStamp - start) / MSINWEEK) + 1,
    nextTimeStamp:
      start +
      MSINWEEK * (Math.floor((currentTimeStamp - start) / MSINWEEK) + 1),
  };
};
