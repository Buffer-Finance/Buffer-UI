import { priceAtom } from '@Hooks/usePrice';
import { getCachedPriceFromKlines } from '@TV/useDataFeed';
import { marketsForChart } from '@Views/TradePage/config';
import { useAtomValue } from 'jotai';

export const useMarketPrice = (tvID: string | undefined) => {
  const marketPrice = useAtomValue(priceAtom);

  if (tvID === undefined)
    return {
      price: undefined,
      precision: 0,
    };

  return {
    price: getCachedPriceFromKlines({ tv_id: tvID }),
    precision:
      marketsForChart[
        tvID as keyof typeof marketsForChart
      ].price_precision.toString().length - 1,
  };
};
