import {
  add,
  divide,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';

//returns payout percentage
export default function getPayout(settlementFee: string) {
  //   if (!payout) return null;
  return subtract('100', multiply('2', divide(settlementFee, 2) as string));
}
export function getMultiplier(settlementFee: string) {
  if (!settlementFee) return ['', ''];
  //   if (!payout) return null;
  let payout = getPayout(settlementFee);
  let sf = divide(add(payout, '100'), '100');
  return [sf, sf + 'x'];
}

export function getSettlementFee(payout: string) {
  return divide(multiply(subtract('100', payout), 2), '2') as string;
}
