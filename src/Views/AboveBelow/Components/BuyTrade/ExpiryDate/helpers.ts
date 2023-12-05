export function formatDateShort(timestamp: number) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export function getTimestamps(date = Date.now()) {
  // Start of Day (8 PM current day or next day)
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(20, 0, 0, 0);

  // Check if the current time has passed 8 PM
  if (startOfDay.getTime() <= date) {
    startOfDay.setUTCDate(startOfDay.getUTCDate() + 1); // Move to the next day
  }

  // End of Week (Friday) at 8 PM
  const endOfWeek = new Date(date);
  const daysUntilFriday = (5 - endOfWeek.getUTCDay() + 7) % 7; // Calculate days until Friday
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilFriday);
  endOfWeek.setUTCHours(20, 0, 0, 0);

  return [startOfDay.getTime(), endOfWeek.getTime()];
}
