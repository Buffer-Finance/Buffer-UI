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

  if (!markets) return undefined;
  const urlMarket = params.market.toUpperCase();
  const [token0, token1] = urlMarket.split('-');
  const market = findMarket(markets, token0, token1);
  if (market) {
    activeMarket = market;
  } else {
    activeMarket = findMarket(markets, 'BTC', 'USD');
  }
  return activeMarket;
};
