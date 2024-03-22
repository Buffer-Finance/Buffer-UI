import getMinimumValue from './getMinimumValue';

//returns the minimum value from multiple strings
export default function getMinimumValueFromArray(values: string[]): string {
  return values.reduce((acc, curr) => {
    return getMinimumValue(acc, curr);
  }, '0');
}
