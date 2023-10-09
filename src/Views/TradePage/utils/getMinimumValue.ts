import { gt } from '@Utils/NumString/stringArithmatics';

//returns the minimum value from two strings
export default function getMinimumValue(
  value1: string,
  value2: string
): string {
  try {
    if (gt(value1, value2)) {
      return value2;
    }
    return value1;
  } catch (e) {
    console.log('stats-deb', value1, value2, typeof value1, typeof value2);
    return '0';
  }
}
