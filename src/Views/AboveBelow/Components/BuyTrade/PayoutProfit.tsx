import { toFixed } from '@Utils/NumString';
import {
  divide,
  gt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { useNumberOfContracts } from '@Views/AboveBelow/Hooks/useNumberOfContracts';
import {
  selectedPoolActiveMarketAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { useAtomValue } from 'jotai';

export const PayoutProfit = ({}: {}) => {
  const amount = useAtomValue(tradeSizeAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const tradeData = useNumberOfContracts();
  if (
    !!amount &&
    gt(amount, '0') &&
    activeMarket !== undefined &&
    tradeData !== null
  ) {
    const tradeToken = activeMarket.poolInfo.token.toUpperCase();
    const { contracts, totalFee } = tradeData;
    const paidAmount = multiply(contracts, totalFee.toString());
    if (contracts === '0') return <> </>;
    const totalPayout = multiply(
      divide(subtract(contracts, paidAmount), paidAmount) as string,
      2
    );
    return (
      <div className="flex-sbw text-f14 my-3 mb-4 sm:my-[0px] ">
        <div className="text-f12 b1200:text-f14 items-start flex-start flex-col b1200: flex wrap b1200:items-center text-2 b1200:flex-row">
          <span className="nowrap mb-1">Payout&nbsp;</span>
          <RowGap gap="4px">
            <Display
              className="text-1 text-f16 b1200:text-f14 !whitespace-nowrap"
              data={contracts}
              unit={tradeToken}
            />
            {toFixed(totalPayout, 0) + '%'}
          </RowGap>
        </div>
        <div className="text-f12 b1200:text-f14 items-end flex-col flex-start wrap flex text-2  gap-y-1 b1200:items-center b1200:flex-row">
          <span> Profit&nbsp; </span>
          {/* <span className="text-green a1200:hidden">
              {' '}
              {activeTab == 'Limit' ? '>' : ''}&nbsp;
            </span> */}
          <Display
            className=" text-f16 text-green sm:text-f14 !whitespace-nowrap"
            data={subtract(contracts, paidAmount)}
            unit={tradeToken}
          />
        </div>
      </div>
    );
  } else {
    return (
      // <Skeleton
      //   className="custom-h full-width sr lc my-3 !h-6"
      //   variant="rectangular"
      // />
      <></>
    );
  }
};
