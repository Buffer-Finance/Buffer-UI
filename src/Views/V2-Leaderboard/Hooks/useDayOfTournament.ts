import { useActiveChain } from '@Hooks/useActiveChain';
import { DailyTournamentConfig } from '../Incentivised/config';

export const useDayOfTournament = (startTime?: number) => {
  //returns the current day of the tournament
  // const startTimestamp = useMemo(() => new Date(startTimeStamp).getTime(), []); //start time of the tournament at 12:00:00 AM UTC
  const { activeChain } = useActiveChain();
  const configValue = DailyTournamentConfig[activeChain.id];
  const currentTimeStamp = new Date().getTime();
  const startTimeStamp = startTime || configValue.startTimestamp;
  return {
    day:
      Math.floor((currentTimeStamp - startTimeStamp) / (1000 * 60 * 60 * 24)) +
      1,
    nextTimeStamp:
      startTimeStamp +
      1000 *
        60 *
        60 *
        24 *
        (Math.floor(
          (currentTimeStamp - startTimeStamp) / (1000 * 60 * 60 * 24)
        ) +
          1),
  };
};
