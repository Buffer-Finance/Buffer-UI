const MSINWEEK = 604800000;

export const useWeekOfTournament = ({
  startTimestamp,
}: {
  startTimestamp: number;
}) => {
  const currentTimeStamp = new Date().getTime();

  return {
    week: Math.floor((currentTimeStamp - startTimestamp) / MSINWEEK) + 1,
    nextTimeStamp:
      startTimestamp +
      MSINWEEK *
        (Math.floor((currentTimeStamp - startTimestamp) / MSINWEEK) + 1),
  };
};
