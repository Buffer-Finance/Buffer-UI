import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useAtomValue } from 'jotai';
import { getRoundedPrice } from '../Components/BuyTrade/PriceTable/helpers';
import { aboveBelowActiveMarketAtom } from '../atoms';

export const useStrikePriceArray = () => {
  const activeMarket = useAtomValue(aboveBelowActiveMarketAtom);
  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });

  if (activeMarket === undefined)
    return {
      currentPrice,
      precision,
      decreasingPriceArray: [],
      increasingPriceArray: [],
    };

  const roundedPrice = getRoundedPrice(
    +currentPrice,
    +activeMarket.config.stepSize
  );
  const decreasingPriceArray = Array.from({ length: 5 }, (_, i) => {
    let startPrice = roundedPrice;
    if (startPrice > currentPrice) {
      startPrice = roundedPrice - +activeMarket.config.stepSize;
    }
    return startPrice - i * +activeMarket.config.stepSize;
  }).reverse();
  const increasingPriceArray = Array.from({ length: 5 }, (_, i) => {
    let startPrice = roundedPrice;
    if (startPrice < currentPrice) {
      startPrice = roundedPrice + +activeMarket.config.stepSize;
    }
    return startPrice + i * +activeMarket.config.stepSize;
  });

  return {
    currentPrice,
    precision,
    decreasingPriceArray,
    increasingPriceArray,
  };
};
