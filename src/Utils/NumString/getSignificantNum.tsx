const getSignificantNum = (str: string) => {
  // 1.remove leading zeros
  if (!str.length) {
    return "";
  }
  const e = str.indexOf("e");
  const decimal = str.indexOf(".");
  const isFloat = decimal !== -1;
  let decimalSuffix = "";
  let eSuffix = "";
  if (e !== -1) {
    // 1.2e34 = 1.2 e34
    eSuffix = str.substring(e);
    str = str.substring(0, e);
  }
  if (e === 0) {
    if (str === "e") {
      throw new Error("e must contain surrounding digits");
    }
    throw new Error("e must have leading digits");
  }
  if (str === ".") {
    throw new Error(". is not a valid number");
  }
  if (isFloat) {
    decimalSuffix = str.substring(decimal);
    str = str.substring(0, decimal);
    if (decimal === 0) str = "0";
  }
  let nonZeroIdxFromRight = 0;
  let n = str.length;
  for (let char of str) {
    if (char !== "0" || nonZeroIdxFromRight === n - 1) {
      break;
    }
    nonZeroIdxFromRight++;
  }
  let leftSignificantPart =
    str.substring(nonZeroIdxFromRight) + decimalSuffix + eSuffix;
  // leftSignificantPart is the number w/o leading zeros

  // 2.Remove trailing zeros
  // numbers with e and numbers without decimals are returned w/o modifications
  if (e !== -1) return leftSignificantPart;
  if (decimal === -1) {
    leftSignificantPart = leftSignificantPart + ".0000000000";
    return leftSignificantPart;
  }
  if (decimal) {
    // add 10 zeros to leftSignificantPart if decimal
    leftSignificantPart = leftSignificantPart + "0000000000";
  }
  let strLen = leftSignificantPart.length;
  let rightSignificantIdx = strLen - 1;
  for (let i = strLen - 1; i >= 0; i--) {
    if (leftSignificantPart[i] !== "0") {
      break;
    }
    if (leftSignificantPart[i] === "0" && leftSignificantPart[i - 1] === ".") {
      rightSignificantIdx -= 2;
      break;
    }
    rightSignificantIdx--;
  }
  let significantDigits = leftSignificantPart.substring(
    0,
    rightSignificantIdx + 1
  );
  return leftSignificantPart;
};

export default getSignificantNum;
