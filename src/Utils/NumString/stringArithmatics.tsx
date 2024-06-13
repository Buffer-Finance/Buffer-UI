import Big from 'big.js';
const bigNumberError = (...num) => {
  return num.map((n) => `"${n}": "${typeof n} is NaN, `).join(' ');
};
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
    // throw new Error(bigNumberError(from, to));
    // console.error(bigNumberError(from, to));
    return null;
  }
};
const multiply = (from: string, to: string | number) => {
  try {
    let toBN: Big;
    if (typeof to === 'number') {
      toBN = new Big('10').pow(to);
    } else {
      toBN = new Big(to);
    }
    const fromBN = new Big(from);
    return fromBN.times(toBN).toString();
  } catch (e) {
    throw new Error(bigNumberError(from, to));
    return null;
  }
};
const round = (from: string, to: number) => {
  try {
    if (!from) return null;
    const fromBN = new Big(from).round(to, 1);
    return fromBN.toString();
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const gte = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    return fromBN.gte(toBN);
  } catch (e) {
    throw new Error(bigNumberError(from, to));

    return '-1';
  }
};
const lte = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    return fromBN.lte(toBN);
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const getPosInf = () => {
  const two = new Big(2);
  const one = new Big(2);

  let inf = two.pow(256);
  return inf.minus(one).toString();
};
const gt = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    return fromBN.gt(toBN);
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const minsa = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    if (fromBN.gt(toBN)) {
      return toBN.toString();
    } else {
      return fromBN.toString();
    }
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const lt = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);

    return fromBN.lt(toBN);
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const add = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    return fromBN.add(toBN).toString();
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const subtract = (from: string, to: string) => {
  try {
    const fromBN = new Big(from);
    const toBN = new Big(to);
    return fromBN.minus(toBN).toString();
  } catch (e) {
    throw new Error(bigNumberError(from, to));
  }
};
const abs = (of: string) => {
  try {
    const ofBN = new Big(of);
    return ofBN.abs().toString();
  } catch (e) {
    throw new Error(bigNumberError(of));
  }
};
const roundUp = (of: string) => {
  try {
    const ofBN = new Big(of);
    return ofBN.round(2, 1).toString();
  } catch (e) {
    throw new Error(bigNumberError(of));
  }
};
const toFixed = (of: string, precision: number) => {
  try {
    const ofBN = new Big(of);
    return ofBN.toFixed(precision);
  } catch (e) {
    throw new Error(bigNumberError(of, precision));
  }
};
export {
  divide,
  multiply,
  add,
  subtract,
  gte,
  gt,
  minsa,
  lte,
  abs,
  lt,
  roundUp,
  getPosInf,
  round,
  toFixed,
};
