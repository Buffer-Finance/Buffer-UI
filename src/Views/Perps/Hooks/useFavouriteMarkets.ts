import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { favouriteMarketsAtom } from '../atoms';
import { joinStrings } from '../utils';
import { marketData, useMarketsWithChartData } from './useAssetTableFilters';

export const useUserAddressParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userAddress = useMemo(
    () => searchParams.get('user_address'),
    [searchParams]
  );

  function setUserAddress(user_address: string) {
    setSearchParams({ ...searchParams, user_address: user_address });
  }

  return { userAddress, setUserAddress };
};

export const useFavouriteMarkets = () => {
  const [favMarkets, setFavMarkets] = useAtom(favouriteMarketsAtom);
  const markets = useMarketsWithChartData();
  const navigate = useNavigate();
  const { userAddress: userAddressParam } = useUserAddressParam();

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
    if (userAddressParam) {
      navigate(
        `/binary/${market.marketInfo.pair}?user_address=${userAddressParam}`
      );
    } else navigate(`/binary/${market.marketInfo.pair}`);
  }
  return {
    favouriteMarkets,
    addFavouriteMarket,
    removeFavouriteMarket,
    navigateToMarket,
  };
};
