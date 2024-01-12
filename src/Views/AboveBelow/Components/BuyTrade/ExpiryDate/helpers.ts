export function formatDateShort(timestamp: number) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export function generateTimestamps(): {
  oneMinuteTimestamps: number[];
  fifteenMinuteTimestamps: number[];
  currentTimeStamp: number;
} {
  const oneMinuteTimestamps: number[] = [];
  const fifteenMinuteTimestamps: number[] = [];
  const now = new Date();
  const currentSeconds = now.getSeconds();
  const secondsUntilNextMinute = (60 - currentSeconds) % 60;
  const startTimestamp = Math.floor(
    (now.getTime() + secondsUntilNextMinute * 1000) / 1000
  );

  for (let i = 1; i <= 15; i++) {
    const nextOneMinuteTimestamp = startTimestamp + i * 60;
    oneMinuteTimestamps.push(nextOneMinuteTimestamp * 1000);
  }

  const lastOneMinuteTimestamp =
    oneMinuteTimestamps[oneMinuteTimestamps.length - 1];

  // Find the next quarter-hour boundary
  const nextQuarterHour =
    Math.ceil(lastOneMinuteTimestamp / (15 * 60000)) * (15 * 60000);

  for (let i = 0; i < 4 * 60; i += 15) {
    const nextFifteenMinuteTimestamp = nextQuarterHour + i * 60000;
    // if the timestamp is greater than the current time + 4 hours then break
    if (nextFifteenMinuteTimestamp > now.getTime() + 4 * 60 * 60000) break;
    fifteenMinuteTimestamps.push(nextFifteenMinuteTimestamp);
  }

  return {
    oneMinuteTimestamps,
    fifteenMinuteTimestamps,
    currentTimeStamp: now.getTime(),
  };
}

function formatTwoDigitNumber(number: number) {
  return String(number).padStart(2, '0');
}

export const formatTimestampToHHMM = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${formatTwoDigitNumber(hours)}:${formatTwoDigitNumber(minutes)}`;
};

export const formatDateWithTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const year = date.getFullYear();
  return `${day} ${month} ${year} , ${hours}:${minutes}`;
};

export function getTimestamps(date = Date.now()) {
  const timestamps = [];
  const currentTimestamp = new Date(date).getTime();
  // Start of Day (8 PM current day or next day)
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(8, 0, 0, 0);

  // Check if the current time has passed 8 PM
  if (startOfDay.getTime() <= date) {
    startOfDay.setUTCDate(startOfDay.getUTCDate() + 1); // Move to the next day
  }
  const startOfDayTimestamp = startOfDay.getTime();

  //dont show if the start of day is more than 12 hours away
  if (startOfDayTimestamp - currentTimestamp > 43200000) {
    timestamps.push(startOfDayTimestamp);
  }

  //add next day if the start of day is less than 36 hours away
  if (startOfDayTimestamp - currentTimestamp < 129600000) {
    const nextDay = new Date(date);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    nextDay.setUTCHours(8, 0, 0, 0);
    const nextDayTimestamp = nextDay.getTime();
    timestamps.push(nextDayTimestamp);
  }

  // End of Week (Friday) at 8 PM
  const endOfWeek = new Date(date);
  const daysUntilFriday = (5 - endOfWeek.getUTCDay() + 7) % 7; // Calculate days until Friday
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilFriday);
  endOfWeek.setUTCHours(8, 0, 0, 0);
  const endOfWeekTimestamp = endOfWeek.getTime();

  if (endOfWeekTimestamp - currentTimestamp > 43200000)
    timestamps.push(endOfWeekTimestamp);

  //add next week if the end of week is less than 36 hours away
  if (endOfWeekTimestamp - currentTimestamp < 129600000) {
    const nextWeek = new Date(date);

    nextWeek.setUTCDate(
      nextWeek.getUTCDate() + ((5 - nextWeek.getUTCDay() + 7) % 7) + 7
    );
    nextWeek.setUTCHours(8, 0, 0, 0);
    const nextWeekTimestamp = nextWeek.getTime();
    timestamps.push(nextWeekTimestamp);
  }
  // return unique timestamps
  return [...new Set(timestamps)];
}
