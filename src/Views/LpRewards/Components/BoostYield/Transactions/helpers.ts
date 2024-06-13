export function convertToNumberOfMonthsAndDays(seconds: number) {
  // conver the given seconds in to number of months and days
  const months = Math.floor(seconds / 2629746);
  const days = Math.floor((seconds % 2629746) / 86400);
  return { months: 0, days: seconds / (24 * 60 * 60) };
}
