import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';

export const CurrentPrice: React.FC<{
  token0: string;
  token1: string;
}> = ({ token0, token1 }) => {
  const { currentPrice } = useCurrentPrice({ token0, token1 });
  return <> {currentPrice}</>;
};
