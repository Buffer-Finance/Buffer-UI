import Big from 'big.js';
export interface IContract {
  abi: any[];
  contract: string;
}
export interface BN {
  gt: (num: Big) => boolean;
  toString: () => string;
  gte: (num: Big) => boolean;
  lt: (num: Big) => boolean;
  lte: (num: Big) => boolean;
  div: (num: Big) => Big;
  abs: () => Big;
  times: (num: Big) => Big;
  pow: (num: number) => Big;
  add: (num: Big) => Big;
  minus: (num: Big) => Big;
  round: (num: number, mode: number) => string;
  eq: (num: Big | string) => boolean;
  toFixed: (num: number) => string;
}
