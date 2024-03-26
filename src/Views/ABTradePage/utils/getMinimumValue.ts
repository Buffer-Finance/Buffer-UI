import { gt } from '@Utils/NumString/stringArithmatics';

//returns the minimum value from two strings
export default function getMinimumValue(
  value1: string,
  value2: string
): string {
  if (gt(value1, value2)) {
    return value2;
  }
  return value1;
}
