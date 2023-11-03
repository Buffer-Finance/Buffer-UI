import { round } from '@Utils/NumString/stringArithmatics';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { Skeleton } from '@mui/material';

export const CurrentPrice = ({
  market,
  className = 'text-1',
}: {
  market: InoLossMarket;
  className?: string;
}) => {
  const { price, precision } = useMarketPrice(market.chartData.tv_id);
  if (!price) return <Skeleton className="w-[80px] !h-5 lc " />;
  return <div className={className}>{round(price, precision)}</div>;
};
