import {
  add,
  divide,
  gt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { Skeleton } from '@mui/material';

export const PayoutProfit = ({
  amount,
  boostedPayout,
  totalPayout,
  tradeToken,
}: {
  amount: string;
  totalPayout: string;
  boostedPayout: string;
  tradeToken: string;
}) => {
  if (amount && totalPayout) {
    return (
      <div className="flex-sbw text-f14 my-3 mb-4">
        <div className="text-f12 sm:text-f14 items-start flex-col flex-start flex wrap text-2 sm:flex-row">
          <span className="nowrap mb-1">Payout</span>
          <RowGap gap="4px">
            <Display
              className="text-1 text-f16 sm:text-f14 !whitespace-nowrap"
              data={multiply(
                add('1', divide(totalPayout, 2) as string),
                amount
              )}
              unit={tradeToken}
            />
            {totalPayout + '%'}
          </RowGap>
        </div>
        <div className="text-f12 sm:text-f14 items-start flex-col flex-start wrap flex text-2  gap-y-1 sm:flex-row">
          Profit
          <Display
            className=" text-f16 text-green sm:text-f14 !whitespace-nowrap"
            data={subtract(
              multiply(add('1', divide(totalPayout, 2) as string), amount),
              amount
            )}
            unit={tradeToken}
          />
        </div>
      </div>
    );
  } else {
    return (
      <Skeleton
        className="custom-h full-width sr lc mb3"
        variant="rectangular"
      />
    );
  }
};
