import { round } from '@Utils/NumString/stringArithmatics';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import { Display } from '@Views/Common/Tooltips/Display';
import { Skeleton } from '@mui/material';

export const Price: React.FC<{
  tv_id: string;
  className?: string;
}> = ({ tv_id, className = '' }) => {
  const { price, precision } = useMarketPrice(tv_id);
  return !price ? (
    <Skeleton className="w-[80px] !h-5 lc " />
  ) : (
    <Display
      data={round(price, precision)}
      precision={precision}
      className={`!py-[1px] ${className}`}
    />
  );
};
