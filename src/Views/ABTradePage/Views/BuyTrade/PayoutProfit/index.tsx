import {
  add,
  divide,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { tradeTypeAtom } from '@Views/ABTradePage/atoms';
import { Skeleton } from '@mui/material';
import { useAtom } from 'jotai';

export const PayoutProfit = ({
  amount,
  totalPayout,
  tradeToken,
}: {
  amount: string | undefined | null;
  totalPayout: string | undefined | null;
  tradeToken: string;
}) => {
  const [activeTab, setActiveTab] = useAtom(tradeTypeAtom);
  const isLimitorderTab = activeTab == 'Limit';

  if (amount && totalPayout) {
    return (
      <div className="flex-sbw text-f14 my-3 mb-4">
        <div className="text-f12 b1200:text-f14 items-start flex-start flex-col b1200: flex wrap b1200:items-center text-2 b1200:flex-row">
          <span className="nowrap mb-1">
            {isLimitorderTab && <span>Min</span>} Payout&nbsp;{' '}
            {/* <span className="text-1 a1200:hidden">
              {activeTab == 'Limit' ? '>' : ''}&nbsp;
            </span> */}
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
        <div className="text-f12 b1200:text-f14 items-end flex-col flex-start wrap flex text-2  gap-y-1 b1200:items-center b1200:flex-row">
          <span> {isLimitorderTab && <span>Min</span>} Profit&nbsp; </span>
          {/* <span className="text-green a1200:hidden">
            {' '}
            {activeTab == 'Limit' ? '>' : ''}&nbsp;
          </span> */}
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
    console.log('dd-dd', amount, totalPayout);
    return (
      <Skeleton
        className="custom-h full-width sr lc my-3 !h-6"
        variant="rectangular"
      />
    );
  }
};
