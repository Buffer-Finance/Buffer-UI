const isAvailable = (num: string | null | undefined | number) => {
  if (num == '') return false;
  if (typeof num == 'undefined') return false;
  if (num == undefined || num == null) {
    return false;
  }
  return true;
};

const zeroify = (num: any) => {
  if (isAvailable(num)) {
    if (typeof num == 'number') {
      return num.toFixed();
    } else if (typeof num == 'string') {
      return num;
    }
  }
  return '0';
};
export const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
}).format;

export { zeroify, isAvailable };
