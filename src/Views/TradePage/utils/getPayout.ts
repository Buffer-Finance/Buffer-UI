import { divide, multiply, subtract } from '@Utils/NumString/stringArithmatics';

//returns payout percentage
export default function getPayout(payout: string) {
  //   if (!payout) return null;
  return subtract('100', multiply('2', divide(payout, 2) as string));
}
