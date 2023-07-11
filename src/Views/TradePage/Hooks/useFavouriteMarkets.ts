import { useAtom } from 'jotai';
import { favouriteMarketsAtom } from '../atoms';
import { useMemo } from 'react';
import { joinStrings } from '../utils';
import { useMarketsConfig } from './useMarketsConfig';
import { marketType } from '../type';
import { useNavigate } from 'react-router-dom';
import { useActiveMarket } from './useActiveMarket';

export const useFavouriteMarkets = () => {
  const [favMarkets, setFavMarkets] = useAtom(favouriteMarketsAtom);
  const markets = useMarketsConfig();
  const navigate = useNavigate();
  const { activeMarket } = useActiveMarket();

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
            joinStrings(market.token0, market.token1, '/') === favMarket
        );
      })
      .filter((market) => market !== undefined) as marketType[];
    return pinnedMarkets;
  }, [favMarkets, markets]);

  function getMarketPairName(market: marketType) {
    return joinStrings(market.token0, market.token1, '/');
  }

  function addFavouriteMarket(market: marketType) {
    if (favMarkets.includes(getMarketPairName(market))) {
      return;
    }
    const newMarkets = [...favMarkets];
    newMarkets.unshift(getMarketPairName(market));
    setFavMarkets(newMarkets);
  }

  function removeFavouriteMarket(market: marketType) {
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

  //TODO - V2.1 change this to binary
  function navigateToMarket(market: marketType) {
    navigate(`/v2/${joinStrings(market.token0, market.token1, '-')}`);
  }
  return {
    favouriteMarkets,
    addFavouriteMarket,
    removeFavouriteMarket,
    navigateToMarket,
  };
};
