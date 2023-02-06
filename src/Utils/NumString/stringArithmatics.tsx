import Big from "big.js";
import { BN } from "src/Interfaces/interfaces";
const divide = (from: string, to: string | number) => {
  // if()
  try {
    const fromBN: BN = new Big(from);
    let toBN: BN;
    if (typeof to === "number") {
      toBN = new Big("10").pow(to);
    } else {
      toBN = new Big(to);
    }
    if (toBN.eq("0")) return undefined;
    return fromBN.div(toBN).toString();
  } catch (e) {
    return null;
  }
};
const multiply = (from: string, to: string | number) => {
  let toBN: BN;
  if (typeof to === "number") {
    toBN = new Big("10").pow(to);
  } else {
    toBN = new Big(to);
  }
  const fromBN: BN = new Big(from);
  return fromBN.times(toBN).toString();
};
const gte = (from: string, to: string) => {
  const fromBN: BN = new Big(from);
  const toBN: BN = new Big(to);
  return fromBN.gte(toBN);
};
const lte = (from: string, to: string) => {
  const fromBN: BN = new Big(from);
  const toBN: BN = new Big(to);
  return fromBN.lte(toBN);
};
const getPosInf = () => {
  const two: BN = new Big(2);
  const one: BN = new Big(2);

  let inf: BN = two.pow(256);
  return inf.minus(one).toString();
};
const gt = (from: string, to: string) => {
  const fromBN: BN = new Big(from);
  const toBN: BN = new Big(to);
  return fromBN.gt(toBN);
};
const lt = (from: string, to: string) => {
  const fromBN: BN = new Big(from);
  const toBN: BN = new Big(to);
  return fromBN.lt(toBN);
};
const add = (from: string, to: string) => {
  const fromBN: BN = new Big(from);
  const toBN: BN = new Big(to);
  return fromBN.add(toBN).toString();
};
const subtract = (from: string, to: string) => {
  const fromBN: BN = new Big(from);
  const toBN: BN = new Big(to);
  return fromBN.minus(toBN).toString();
};
const abs = (of: string) => {
  const ofBN: BN = new Big(of);
  return ofBN.abs().toString();
};
const roundUp = (of: string) => {
  const ofBN: BN = new Big(of);
  return ofBN.round(2, 1).toString();
};
const toFixed = (of: string, precision: number) => {
  const ofBN: BN = new Big(of);
  return ofBN.toFixed(precision);
};
export {
  divide,
  multiply,
  add,
  subtract,
  gte,
  gt,
  lte,
  abs,
  lt,
  roundUp,
  getPosInf,
  toFixed,
};
