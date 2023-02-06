// import eToWide from "./eToWide";

// import { toFixed } from "./stringArithmatics";

// export default toFixed;
import eToWide from "./eToWide";

const toFixed = (str: string | number, fixed: number): string => {
  if (typeof str === "number") {
    str = str.toString();
  }
  str = eToWide(str);
  if (!str) return null;
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  const result = str.match(re);
  return result ? result[0] : null;
};

export default toFixed;
