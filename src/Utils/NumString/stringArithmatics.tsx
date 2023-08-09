import Big from 'big.js';

const divide = (from: string | number, to: string | number) => {
  try {
    const fromBN = new Big(from);
    let toBN: Big;
    if (typeof to === 'number') {
      toBN = new Big('10').pow(to);
    } else {
      toBN = new Big(to);
    }
    if (toBN.eq('0')) throw new Error("CustomError:can't divide with zero");
    return fromBN.div(toBN).toString();
  } catch (e) {
    return null;
  }
};
const multiply = (from: string, to: string | number) => {
  let toBN: Big;
  if (typeof to === 'number') {
    toBN = new Big('10').pow(to);
  } else {
    toBN = new Big(to);
  }
  const fromBN = new Big(from);
  return fromBN.times(toBN).toString();
};
const round = (from: string, to: number) => {
  if (!from) return null;
  const fromBN = new Big(from).round(to, 1);
  return fromBN.toString();
};
const gte = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    return fromBN.gte(toBN);
  } catch (e) {
    return '-1';
  }
};
const lte = (from: string, to: string) => {
  const fromBN = new Big(from);
  const toBN = new Big(to);
  return fromBN.lte(toBN);
};
const getPosInf = () => {
  const two = new Big(2);
  const one = new Big(2);

  let inf = two.pow(256);
  return inf.minus(one).toString();
};
const gt = (from: string, to: string) => {
  const fromBN = new Big(from);
  const toBN = new Big(to);
  return fromBN.gt(toBN);
};
const lt = (from: string, to: string) => {
  const fromBN = new Big(from);
  const toBN = new Big(to);

  return fromBN.lt(toBN);
};
const add = (from: string, to: string) => {
  const fromBN = new Big(from);
  const toBN = new Big(to);
  return fromBN.add(toBN).toString();
};
const subtract = (from: string, to: string) => {
  const fromBN = new Big(from);
  const toBN = new Big(to);
  return fromBN.minus(toBN).toString();
};
const abs = (of: string) => {
  const ofBN = new Big(of);
  return ofBN.abs().toString();
};
const roundUp = (of: string) => {
  const ofBN = new Big(of);
  return ofBN.round(2, 1).toString();
};
const toFixed = (of: string, precision: number) => {
  const ofBN = new Big(of);
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
  round,
  toFixed,
};
