export function formatDateShort(timestamp: number) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export function getTimestamps(date = Date.now()) {
  // End of Day
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // End of Week (Friday)
  const endOfWeek = new Date(date);
  const daysUntilFriday = (5 - endOfWeek.getUTCDay() + 7) % 7; // Calculate days until Friday
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilFriday);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  return [endOfDay.getTime(), endOfWeek.getTime()];
}
