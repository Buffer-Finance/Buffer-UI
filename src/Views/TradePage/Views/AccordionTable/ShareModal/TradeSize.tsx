import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';

export const TradeSize = ({
  tradeSize,
  unit,
  decimals,
}: {
  tradeSize: string;
  unit: string;
  decimals: number;
}) => {
  return (
    <div className="flex flex-col whitespace-nowrap">
      <div className="text-[11px] font-semibold">{'Trade Size'}</div>
      <div className="text-f14 ">
        <Display
          data={divide(tradeSize, decimals)}
          //   unit={unit}
          precision={2}
          className="inline whitespace-pre"
        />
      </div>
    </div>
  );
};
