import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { Display } from '@Views/Common/Tooltips/Display';
import { TradeType } from '@Views/TradePage/type';
import { useMemo } from 'react';

export const ShareTradeData = ({
  trade,
  unit,
  decimals,
  expiryPrice,
}: {
  trade: TradeType;
  unit: string;
  decimals: number;
  expiryPrice: string;
}) => {
  const priceArr = useMemo(
    () => [
      {
        key: 'Strike Price',
        value: (
          <Display
            data={divide(trade.strike, 8)}
            unit={unit}
            precision={decimals}
            className="inline whitespace-pre"
          />
        ),
      },
      {
        key: 'Expiry Price',
        value: (
          <Display
            data={divide(expiryPrice, 8)}
            unit={unit}
            precision={decimals}
            className="inline whitespace-nowrap"
          />
        ),
      },
      {
        key: 'Duration',
        value: formatDistanceExpanded(Variables(+trade.period)),
      },
    ],
    [trade]
  );

  return (
    <div className="flex justify-between items-center gap-x-5 mt-3">
      {priceArr.map((p) => {
        return (
          <div className="flex flex-col whitespace-nowrap">
            <div className="text-[11px] font-medium">{p.key}</div>
            <div className="text-f14 font-medium">{p.value}</div>
          </div>
        );
      })}
    </div>
  );
};
