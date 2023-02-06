

const toHex = (num: number) => {
  return `0x${num.toString(16)}`;
};
export const toFixedStr = (num: number, fixed: number): string => {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  const result = parseFloat(num.toString()).toFixed(18).match(re)!;
  return result ? result[0] : null;
};
export {toHex}
export const formatToFixed = (
  num: number,
  fixed: number,
  decimal: number
): string => {
  const decimals = Math.pow(10, decimal);
  return toFixedStr(num / decimals, fixed);
};

export const numberWithCommas = (num: number | string): string => {
  if (typeof num === "number") {
    num = num.toString();
  }
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const stringWithCommas = (num: string): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
