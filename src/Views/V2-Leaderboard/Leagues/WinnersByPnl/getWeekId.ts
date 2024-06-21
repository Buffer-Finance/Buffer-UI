export function getWeekId(offset: number): number {
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * (86400 * 7);
  }
  let dayTimestamp = Math.floor(
    (timestamp - 6 * 86400 - 16 * 3600) / (86400 * 7)
  );
  return dayTimestamp;
}

export function getLeaderboardWeekId(offSet: number): number {
  return getWeekId(offSet);
}

export function getTimestampFromWeekId(weekId: number) {
  // Calculate the timestamp
  let timestamp = weekId * 7 * 86400 + 6 * 86400 + 16 * 3600;

  return timestamp;
}
