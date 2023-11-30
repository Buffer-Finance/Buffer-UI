import { round } from '@Utils/NumString/stringArithmatics';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Display } from '@Views/Common/Tooltips/Display';
import { Skeleton } from '@mui/material';

export const ActiveMarketPrice: React.FC<{
  market: marketTypeAB | undefined;
}> = ({ market }) => {
  const { price, precision } = useMarketPrice(market?.tv_id);

  if (market === undefined || !price)
    return <Skeleton className="w-[100px] !h-7 lc " />;

  return (
    <div className="text-f18 b1200:text-f12">
      <Display
        className="!justify-start"
        data={round(price, precision)}
        precision={precision}
      />
    </div>
  );
};
