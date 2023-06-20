import { priceAtom } from '@Hooks/usePrice';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { toFixed } from '@Utils/NumString';
import { roundToTwo } from '@Utils/roundOff';
import { marketsForChart } from '@Views/TradePage/config';
import { joinStrings } from '@Views/TradePage/utils';
import { useAtomValue } from 'jotai';

export const useCurrentPrice = ({
  token0,
  token1,
}: {
  token0: string;
  token1: string;
}) => {
  const marketPrice = useAtomValue(priceAtom);
  const marketId = joinStrings(token0, token1, '');
  const activeChartMarket =
    marketsForChart[marketId as keyof typeof marketsForChart];
  const price = getPriceFromKlines(marketPrice, activeChartMarket);
  const precision = activeChartMarket.price_precision.toString().length - 1;
  // console.log(`precision: `, precision, price);
  return { currentPrice: Number(roundToTwo(price, precision)), precision };
};
