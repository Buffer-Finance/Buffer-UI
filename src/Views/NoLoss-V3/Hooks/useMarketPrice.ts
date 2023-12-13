import { priceAtom } from '@Hooks/usePrice';
import { getCachedPriceFromKlines } from '@TV/useDataFeed';
import { toFixed } from '@Utils/NumString';
import { useAtomValue } from 'jotai';
import { marketsForChart } from '../config';

export const useMarketPrice = (tvID: string | undefined) => {
  const marketPrice = useAtomValue(priceAtom);

  if (tvID === undefined)
    return {
      price: undefined,
      precision: 0,
    };
  const price = getCachedPriceFromKlines({ tv_id: tvID });
  const precision =
    marketsForChart[
      tvID as keyof typeof marketsForChart
    ].price_precision.toString().length - 1;
  document.title = (toFixed(price, precision) as string) + ' | ' + tvID;
  return {
    price: getCachedPriceFromKlines({ tv_id: tvID }),
    precision:
      marketsForChart[
        tvID as keyof typeof marketsForChart
      ].price_precision.toString().length - 1,
  };
};
