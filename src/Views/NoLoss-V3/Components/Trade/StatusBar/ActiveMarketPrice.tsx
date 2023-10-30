import { Display } from '@Views/Common/Tooltips/Display';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { Skeleton } from '@mui/material';

export const ActiveMarketPrice: React.FC<{
  market: InoLossMarket | undefined;
}> = ({ market }) => {
  const { price, precision } = useMarketPrice(market?.chartData.tv_id);

  if (market === undefined || !price)
    return <Skeleton className="w-[100px] !h-7 lc " />;

  return (
    <div className="text-f18 b1200:text-f12">
      <Display className="!justify-start" data={price} precision={precision} />
    </div>
  );
};
