import { add, divide } from '@Utils/NumString/stringArithmatics';
import { tokenX24hrsStats } from '@Views/DashboardV2/types';

export const get24hrsStats = (
  data: tokenX24hrsStats[],
  decimals: number
): tokenX24hrsStats => {
  return data.reduce(
    (acc, curr) => {
      return {
        amount: add(acc.amount, divide(curr.amount, decimals) as string),
        settlementFee: add(
          acc.settlementFee,
          divide(curr.settlementFee, decimals) as string
        ),
      };
    },
    { amount: '0', settlementFee: '0' }
  );
};
