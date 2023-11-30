import { round } from '@Utils/NumString/stringArithmatics';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Skeleton } from '@mui/material';

export const CurrentPrice = ({
  market,
  className = 'text-1',
}: {
  market: marketTypeAB;
  className?: string;
}) => {
  const { price, precision } = useMarketPrice(market.tv_id);
  if (!price) return <Skeleton className="w-[80px] !h-5 lc " />;
  return <div className={className}>{round(price, precision)}</div>;
};
