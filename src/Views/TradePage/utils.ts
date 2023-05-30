import {
  divide,
  gt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';

// returns the token1 and toklen0 value from string
export function getTokens(inputString: string, delimiter: string): string[] {
  const delimiterIndex = inputString.indexOf(delimiter);
  if (delimiterIndex !== -1) {
    const firstPart = inputString.slice(0, delimiterIndex);
    const secondPart = inputString.slice(-delimiter.length);
    return [firstPart, secondPart];
  }
  return [inputString];
}

//return joint string from two strings
export function joinStrings(
  firstString: string,
  secondString: string,
  delimiter: string
): string {
  return `${firstString}${delimiter}${secondString}`;
}

//returns payout percentage
export function getPayout(payout: string) {
  //   if (!payout) return null;
  return subtract('100', multiply('2', divide(payout, 2) as string));
}

//returns the time from seconds in HH:MM format
export function secondsToHHMM(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

//returns the maximum value from two strings
export function getMaximumValue(value1: string, value2: string): string {
  if (gt(value1, value2)) {
    return value1;
  }
  return value2;
}

//returns the maximum value from multiple strings
export function getMaximumValueFromArray(values: string[]): string {
  return values.reduce((acc, curr) => {
    return getMaximumValue(acc, curr);
  }, '0');
}

//returns the minimum value from two strings
export function getMinimumValue(value1: string, value2: string): string {
  if (gt(value1, value2)) {
    return value2;
  }
  return value1;
}

//returns the minimum value from multiple strings
export function getMinimumValueFromArray(values: string[]): string {
  return values.reduce((acc, curr) => {
    return getMinimumValue(acc, curr);
  }, '0');
}
