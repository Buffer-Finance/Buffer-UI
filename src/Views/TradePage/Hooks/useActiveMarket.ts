import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useMarketsConfig } from './useMarketsConfig';
import { marketType } from '@Views/TradePage/type';

export const getActiveMarket = (
  markets: marketType[] | null,
  params: any
): marketType | undefined => {
  let activeMarket = null;

  function findMarket(markets: marketType[], token0: string, token1: string) {
    return markets.find(
      (market) => market.token0 === token0 && market.token1 === token1
    );
  }

  if (!markets || !params?.market) return undefined;
  const urlMarket = params.market.toUpperCase();
  console.log(`urlMarket: `, urlMarket);
  const [token0, token1] = urlMarket.split('-');
  const market = findMarket(markets, token0, token1);
  console.log(`market: `, market);
  if (market) {
    activeMarket = market;
  } else {
    activeMarket = findMarket(markets, 'BTC', 'USD');
  }
  return activeMarket;
};

export const useActiveMarket = (): { activeMarket: marketType | undefined } => {
  const params = useParams();
  const appConfig = useMarketsConfig();
  const activeMarket = useMemo(
    () => getActiveMarket(appConfig, params),
    [appConfig, params]
  );
  console.log(`activeMarket: `, activeMarket);
  return { activeMarket };
};
