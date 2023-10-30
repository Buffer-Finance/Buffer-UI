import {
  add,
  divide,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { noLossTradeSizeAtom } from '@Views/NoLoss-V3/atoms';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { RowGap } from '@Views/TradePage/Components/Row';
import { getMaximumValue } from '@Views/TradePage/utils';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';

export const PayoutProfit = ({
  activeMarket,
}: {
  activeMarket: InoLossMarket;
}) => {
  const amount = useAtomValue(noLossTradeSizeAtom);

  const totalPayout = getMaximumValue(
    divide(activeMarket.payoutForDown, 16) as string,
    divide(activeMarket.payoutForUp, 16) as string
  );
  if (amount) {
    return (
      <div className="flex-sbw text-f14 my-3 mb-4">
        <div className="text-f12 b1200:text-f14 items-start flex-start flex-col b1200: flex wrap b1200:items-center text-2 b1200:flex-row">
          <span className="nowrap mb-1">Payout&nbsp; </span>
          <RowGap gap="4px">
            <Display
              className="text-1 text-f16 b1200:text-f14 !whitespace-nowrap"
              data={multiply(
                add('1', divide(totalPayout, 2) as string),
                amount
              )}
            />
            {totalPayout + '%'}
          </RowGap>
        </div>
        <div className="text-f12 b1200:text-f14 items-end flex-col flex-start wrap flex text-2  gap-y-1 b1200:items-center b1200:flex-row">
          <span>Profit&nbsp; </span>
          <Display
            className=" text-f16 text-green sm:text-f14 !whitespace-nowrap"
            data={subtract(
              multiply(add('1', divide(totalPayout, 2) as string), amount),
              amount
            )}
            unit=""
          />
        </div>
      </div>
    );
  } else {
    console.log('dd-dd', amount, totalPayout);
    return (
      <Skeleton
        className="custom-h full-width sr lc my-3 !h-6"
        variant="rectangular"
      />
    );
  }
};
