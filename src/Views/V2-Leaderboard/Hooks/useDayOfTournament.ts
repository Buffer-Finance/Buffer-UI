export const startTimstamp = 1673539200000;

export const useDayOfTournament = () => {
  //returns the current day of the tournament
  // const startTimstamp = useMemo(() => new Date(startTimeStamp).getTime(), []); //start time of the tournament at 12:00:00 AM UTC
  const currentTimeStamp = new Date().getTime();
  return {
    day:
      Math.floor((currentTimeStamp - startTimstamp) / (1000 * 60 * 60 * 24)) +
      1,
    nextTimeStamp:
      startTimstamp +
      1000 *
        60 *
        60 *
        24 *
        (Math.floor(
          (currentTimeStamp - startTimstamp) / (1000 * 60 * 60 * 24)
        ) +
          1),
  };
};
