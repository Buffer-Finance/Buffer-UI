import { divide, multiply, subtract } from '@Utils/NumString/stringArithmatics';

//returns payout percentage
export default function getPayout(settlementFee: string) {
  //   if (!payout) return null;
  return subtract('100', multiply('2', divide(settlementFee, 2) as string));
}

export function getSettlementFee(payout: string) {
  return divide(multiply(subtract('100', payout), 2), '2') as string;
}
