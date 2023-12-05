export function formatDateShort(timestamp: number) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export function getTimestamps(date = Date.now()) {
  const timestamps = [];
  const currentTimestamp = new Date(date).getTime();
  // Start of Day (8 PM current day or next day)
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(20, 0, 0, 0);

  // Check if the current time has passed 8 PM
  if (startOfDay.getTime() <= date) {
    startOfDay.setUTCDate(startOfDay.getUTCDate() + 1); // Move to the next day
  }
  const startOfDayTimestamp = startOfDay.getTime();

  //dont show if the start of day is more than 12 hours away
  if (startOfDayTimestamp - currentTimestamp > 43200000) {
    timestamps.push(startOfDayTimestamp);
  }
  // End of Week (Friday) at 8 PM
  const endOfWeek = new Date(date);
  const daysUntilFriday = (5 - endOfWeek.getUTCDay() + 7) % 7; // Calculate days until Friday
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilFriday);
  endOfWeek.setUTCHours(20, 0, 0, 0);
  const endOfWeekTimestamp = endOfWeek.getTime();
  timestamps.push(endOfWeekTimestamp);

  //add next week if the end of week is less than 36 hours away
  if (endOfWeekTimestamp - currentTimestamp < 129600000) {
    const nextWeek = new Date(date);
    nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
    nextWeek.setUTCHours(20, 0, 0, 0);
    const nextWeekTimestamp = nextWeek.getTime();
    timestamps.push(nextWeekTimestamp);
  }
  return timestamps;
}
