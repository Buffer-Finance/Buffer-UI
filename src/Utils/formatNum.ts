import numeral from 'numeral';

export function formatNum(num: number): string {
  if (num >= 1000) {
    // For numbers >= 1000, format to 'k' (thousands) with 2 decimal places
    return numeral(num).format('0.00a');
  } else if (num >= 100) {
    // For numbers between 10 and 999, format with 1 decimal place
    return numeral(num).format('0.0');
  } else if (num >= 10) {
    // For numbers between 10 and 999, format with 1 decimal place
    return numeral(num).format('0.00');
  } else if (num >= 1) {
    // For numbers between 1 and 9.999, format with 3 decimal places
    return numeral(num).format('0.000');
  } else {
    // For numbers less than 1, format with 3 decimal places
    return numeral(num).format('0.000');
  }
}
