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
  totalPayout,
  tradeToken,
}: {
  amount: string | undefined | null;
  totalPayout: string | undefined | null;
  tradeToken: string;
}) => {
  if (amount && totalPayout) {
    return (
      <div className="flex-sbw text-f14 my-3 mb-4">
        <div className="text-f12 b1200:text-f14 items-center flex-col flex-start flex wrap text-2 b1200:flex-row">
          <span className="nowrap mb-1">
            Payout <span className="text-1 a1200:hidden">{'>'}&nbsp;</span>
          </span>
          <RowGap gap="4px">
            <Display
              className="text-1 text-f16 b1200:text-f14 !whitespace-nowrap"
              data={multiply(
                add('1', divide(totalPayout, 2) as string),
                amount
              )}
              unit={tradeToken}
            />
            {totalPayout + '%'}
          </RowGap>
        </div>
        <div className="text-f12 b1200:text-f14 items-center flex-col flex-start wrap flex text-2  gap-y-1 b1200:flex-row">
          Profit&nbsp;{' '}
          <span className="text-green a1200:hidden">{'>'}&nbsp;</span>
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
        className="custom-h full-width sr lc my-3 !h-6"
        variant="rectangular"
      />
    );
  }
};
