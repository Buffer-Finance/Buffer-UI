import { priceAtom } from '@Hooks/usePrice';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { round } from '@Utils/NumString/stringArithmatics';
import { marketsForChart } from '@Views/TradePage/config';
import { joinStrings } from '@Views/TradePage/utils';
import { useAtomValue } from 'jotai';
import { Market2Prices } from 'src/Types/Market';
import { chartDataType } from '../type';

export const useCurrentPrice = ({
  token0,
  token1,
}: {
  token0?: string;
  token1?: string;
}) => {
  const marketPrice = useAtomValue(priceAtom);
  if (!token0 || !token1) {
    return { currentPrice: 0, precision: 0 };
  }
  const marketId = joinStrings(token0, token1, '');
  const activeChartMarket =
    marketsForChart[marketId as keyof typeof marketsForChart];
  return getCurrentPrice(marketPrice, activeChartMarket);
  // console.log(`precision: `, precision, price);
};

export const getCurrentPrice = (
  marketPrice: Partial<Market2Prices>,
  activeChartMarket: chartDataType
) => {
  const price = getPriceFromKlines(marketPrice, activeChartMarket);
  const precision = activeChartMarket.price_precision.toString().length - 1;
  return { currentPrice: Number(round(price, precision)), precision };
};
