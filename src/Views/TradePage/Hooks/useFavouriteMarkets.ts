import { useAtom } from 'jotai';
import { favouriteMarketsAtom } from '../atoms';
import { useMemo } from 'react';
import { joinStrings } from '../utils';
import { useNavigate } from 'react-router-dom';
import { marketData, useMarketsWithChartData } from './useAssetTableFilters';

export const useFavouriteMarkets = () => {
  const [favMarkets, setFavMarkets] = useAtom(favouriteMarketsAtom);
  const markets = useMarketsWithChartData();
  const navigate = useNavigate();

  const favouriteMarkets = useMemo(() => {
    if (markets === null) {
      return [];
    }
    if (favMarkets.length === 0) {
      return [];
    }
    const pinnedMarkets = favMarkets
      .map((favMarket) => {
        return markets.find(
          (market) =>
            joinStrings(
              market.marketInfo.token0,
              market.marketInfo.token1,
              '/'
            ) === favMarket
        );
      })
      .filter((market) => market !== undefined) as marketData[];
    return pinnedMarkets;
  }, [favMarkets, markets]);

  function getMarketPairName(market: marketData) {
    return joinStrings(market.marketInfo.token0, market.marketInfo.token1, '/');
  }

  function addFavouriteMarket(market: marketData) {
    if (favMarkets.includes(getMarketPairName(market))) {
      return;
    }
    const newMarkets = [...favMarkets];
    newMarkets.unshift(getMarketPairName(market));
    setFavMarkets(newMarkets);
  }

  function removeFavouriteMarket(market: marketData) {
    // if (favouriteMarkets.length === 1) return;
    const index = favMarkets.indexOf(getMarketPairName(market));
    const newMarkets = [...favMarkets];
    newMarkets.splice(index, 1);

    // if (
    //   activeMarket &&
    //   getMarketPairName(activeMarket) === getMarketPairName(market)
    // ) {
    //   if (favouriteMarkets.length >= index + 1) {
    //     navigate(
    //       `/v2/${favouriteMarkets[index + 1].token0}-${
    //         favouriteMarkets[index + 1].token1
    //       }`
    //     );
    //   } else {
    //     navigate(
    //       `/v2/${favouriteMarkets[index - 1].token0}-${
    //         favouriteMarkets[index - 1].token1
    //       }`
    //     );
    //   }
    // }
    setFavMarkets(newMarkets);
  }

  function navigateToMarket(market: marketData) {
    navigate(`/binary/${market.marketInfo.pair}`);
  }
  return {
    favouriteMarkets,
    addFavouriteMarket,
    removeFavouriteMarket,
    navigateToMarket,
  };
};
