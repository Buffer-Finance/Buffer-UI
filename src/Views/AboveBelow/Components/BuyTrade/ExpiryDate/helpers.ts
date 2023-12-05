export function formatDateShort(timestamp: number) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export function getTimestamps(date = Date.now()) {
  // End of Day (8 AM next day)
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(8, 0, 0, 0);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1); // Move to the next day

  // End of Week (Friday) at 8 AM
  const endOfWeek = new Date(date);
  const daysUntilFriday = (5 - endOfWeek.getUTCDay() + 7) % 7; // Calculate days until Friday
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilFriday);
  endOfWeek.setUTCHours(8, 0, 0, 0);

  return [endOfDay.getTime(), endOfWeek.getTime()];
}
