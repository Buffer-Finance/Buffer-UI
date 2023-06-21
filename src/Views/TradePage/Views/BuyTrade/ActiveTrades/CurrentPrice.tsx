import { Display } from '@Views/Common/Tooltips/Display';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';

export const CurrentPrice: React.FC<{
  token0: string;
  token1: string;
}> = ({ token0, token1 }) => {
  const { currentPrice, precision: marketPrecision } = useCurrentPrice({
    token0,
    token1,
  });
  return (
    <Display
      className="!justify-start"
      data={currentPrice}
      precision={marketPrecision}
    />
  );
};
