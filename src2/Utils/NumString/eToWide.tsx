/**
 * Converts scientific notational number to full wide format
 * @param numString scientific notaitional number string you want to converToFullWide format
 * @returns formatted string
 */
import getSignificantNum from "./getSignificantNum";

const concatChars = (root: string, char: string, times: string) => {
  let timesInt = Number(times);
  if (timesInt === 0) {
    return root;
  }
  let n = root.length;
  let concatedRoot =
    timesInt < 0
      ? root.padStart(n + -1 * timesInt, char)
      : root.padEnd(n + timesInt, char);
  return concatedRoot;
};

const charArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const removeChar = (str: string, position: number) =>
  str.substring(0, position) + str.substring(position + 1);

const eToWide = (str: string) => {
  if (!str) return "0";
  if (!str.length) return "0";
  let isNegative = false;
  if (str[0] == "-") {
    isNegative = true;
    if (str.length <= 1) return "0";
    str = str.substring(1);
  } else if (str[0] == "." && str.length === 1) {
    return "0";
  }
  const e = str.indexOf("e");
  str = getSignificantNum(str);
  if (e === -1) return (isNegative ? "-" : "") + str;
  const decimal = str.indexOf(".");
  const isEPositive = str[e + 1] !== "-";
  let times = Math.abs(Number(str.substring(e + 1)));
  if (isEPositive) {
    if (decimal === -1) {
      // No decimals i.e 1e22
      return (
        (isNegative ? "-" : "") +
        getSignificantNum(
          concatChars(str.substring(0, e), charArr[0], str.substring(e + 1))
        )
      );
    } else {
      // e comes after . always e.g. 1.23e i.e e never comes before e.g 13e44.3

      const decimalRemovedStr = removeChar(str, decimal);
      const e = decimalRemovedStr.indexOf("e");
      const rawStrWODecimalAndE = concatChars(
        decimalRemovedStr.substring(0, e),
        charArr[0],
        decimalRemovedStr.substring(e + 1)
      );
      const maxLen = decimal + times - 1;
      const res =
        rawStrWODecimalAndE.substring(0, maxLen + 1) +
        "." +
        rawStrWODecimalAndE.substring(maxLen + 1);
      return (isNegative ? "-" : "") + getSignificantNum(res);
    }
  } else {
    if (decimal === -1) {
      // No decimals i.e 1e-22
      let WOdecimal = concatChars(
        str.substring(0, e),
        charArr[0],
        str.substring(e + 1)
      );
      const n = WOdecimal.length;
      const decimalPlace = n - times;
      let res =
        WOdecimal.substring(0, decimalPlace) +
        "." +
        WOdecimal.substring(decimalPlace);
      return (isNegative ? "-" : "") + getSignificantNum(res);
    } else {
      // e comes after . always e.g. 1.23e i.e e never comes before e.g 13e44.3
      const decimalRemovedStr = removeChar(str, decimal);
      const e = decimalRemovedStr.indexOf("e");
      const rawStrWODecimalAndE = concatChars(
        decimalRemovedStr.substring(0, e),
        charArr[0],
        decimalRemovedStr.substring(e + 1)
      );
      const maxLen = decimal + times - 1;
      const res =
        rawStrWODecimalAndE.substring(0, decimal) +
        "." +
        rawStrWODecimalAndE.substring(decimal);
      return (isNegative ? "-" : "") + getSignificantNum(res);
    }
  }
};

export default eToWide;
