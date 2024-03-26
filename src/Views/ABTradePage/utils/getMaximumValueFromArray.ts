import getMaximumValue from './getMaximumValue';

//returns the maximum value from multiple strings
export default function getMaximumValueFromArray(values: string[]): string {
  return values.reduce((acc, curr) => {
    return getMaximumValue(acc, curr);
  }, '0');
}
