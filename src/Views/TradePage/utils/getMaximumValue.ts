import { gt } from '@Utils/NumString/stringArithmatics';

//returns the maximum value from two strings
export default function getMaximumValue(
  value1: string,
  value2: string
): string {
  if (gt(value1, value2)) {
    return value1;
  }
  return value2;
}
