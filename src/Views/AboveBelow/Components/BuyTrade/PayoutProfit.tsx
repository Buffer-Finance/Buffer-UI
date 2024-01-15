import {
  add,
  divide,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import {
  readCallDataAtom,
  selectedPoolActiveMarketAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { getPayout } from '@Views/TradePage/utils';
import { isObjectEmpty } from '@Views/TradePage/utils/isObjectEmpty';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { getAddress } from 'viem';

export const PayoutProfit = ({}: {}) => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const amount = useAtomValue(tradeSizeAtom);
  const { data: baseSettlementFees } = useSettlementFee();
  const readcallData = useAtomValue(readCallDataAtom);

  if (
    activeMarket === undefined ||
    readcallData === undefined ||
    baseSettlementFees === undefined ||
    amount === undefined
  )
    return (
      <Skeleton
        className="custom-h full-width sr lc my-3 !h-6"
        variant="rectangular"
      />
    );
  const tradeToken = activeMarket.poolInfo.token;
  let totalPayout: string | null = null;
  if (readcallData && !isObjectEmpty(readcallData.settlementFees)) {
    totalPayout = readcallData.settlementFees[getAddress(activeMarket.address)];
  }
  if (totalPayout === null) {
    const baseSettlementFee =
      baseSettlementFees?.[activeMarket.token0 + activeMarket.token1]
        ?.settlement_fee;

    if (baseSettlementFee) {
      totalPayout = getPayout(baseSettlementFee.toString());
    }
  } else {
    totalPayout = '0';
  }

  return (
    <div className="flex-sbw text-f14 my-3 mb-4">
      <div className="text-f12 b1200:text-f14 items-start flex-start flex-col b1200: flex wrap b1200:items-center text-2 b1200:flex-row">
        <span className="nowrap mb-1">Payout&nbsp;</span>
        <RowGap gap="4px">
          <Display
            className="text-1 text-f16 b1200:text-f14 !whitespace-nowrap"
            data={multiply(
              add('1', divide(totalPayout as string, 2) as string),
              amount
            )}
            unit={tradeToken}
          />
          {totalPayout + '%'}
        </RowGap>
      </div>
      <div className="text-f12 b1200:text-f14 items-end flex-col flex-start wrap flex text-2  gap-y-1 b1200:items-center b1200:flex-row">
        Profit&nbsp;
        <Display
          className=" text-f16 text-green sm:text-f14 !whitespace-nowrap"
          data={subtract(
            multiply(
              add('1', divide(totalPayout as string, 2) as string),
              amount
            ),
            amount
          )}
          unit={tradeToken}
        />
      </div>
    </div>
  );
};
