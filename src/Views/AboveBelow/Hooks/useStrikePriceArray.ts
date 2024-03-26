import { divide } from '@Utils/NumString/stringArithmatics';
import { useCurrentPrice } from '@Views/ABTradePage/Hooks/useCurrentPrice';
import { useAtomValue } from 'jotai';
import { getRoundedPrice } from '../Components/BuyTrade/PriceTable/helpers';
import { selectedPoolActiveMarketAtom } from '../atoms';

export const useStrikePriceArray = () => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
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

  const stepsize = divide(activeMarket.config.stepSize, 8) ?? '0';
  const roundedPrice = getRoundedPrice(+currentPrice, +stepsize);
  const decreasingPriceArray = Array.from({ length: 5 }, (_, i) => {
    let startPrice = roundedPrice;
    if (startPrice > currentPrice) {
      startPrice = roundedPrice - +stepsize;
    }
    return startPrice - i * +stepsize;
  });
  const increasingPriceArray = Array.from({ length: 5 }, (_, i) => {
    let startPrice = roundedPrice;
    if (startPrice < currentPrice) {
      startPrice = roundedPrice + +stepsize;
    }
    return startPrice + i * +stepsize;
  }).reverse();

  return {
    currentPrice,
    precision,
    decreasingPriceArray,
    increasingPriceArray,
  };
};
