import { Display } from '@Views/Common/Tooltips/Display';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { Skeleton } from '@mui/material';

export const CurrentPrice: React.FC<{
  token0: string;
  token1: string;
}> = ({ token0, token1 }) => {
  const { currentPrice, precision: marketPrecision } = useCurrentPrice({
    token0,
    token1,
  });
  console.log(`CurrentPrice-currentPrice: `, currentPrice);
  if (currentPrice === 0) return <Skeleton className="w-[100px] !h-7 lc " />;

  return (
    <Display
      className="!justify-start"
      data={currentPrice}
      precision={marketPrecision}
    />
  );
};
