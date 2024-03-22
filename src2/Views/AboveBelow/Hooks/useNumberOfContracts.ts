import { divide } from '@Utils/NumString/stringArithmatics';
import { useAtomValue } from 'jotai';
import {
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
  tradeSizeAtom,
} from '../atoms';
import { strikePrices } from './useLimitedStrikeArrays';

export const useNumberOfContracts = () => {
  const amount = useAtomValue(tradeSizeAtom);
  const selectedPrice = useAtomValue(selectedPriceAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);

  if (!selectedPrice) return null;
  if (!activeMarket) return null;

  const strikes = strikePrices;
  const activeAssetStrikes = strikes[activeMarket.tv_id];
  if (!activeAssetStrikes) return null;

  const priceObj = selectedPrice[activeMarket.tv_id];
  if (!priceObj) return null;
  let strikePriceObject = activeAssetStrikes.increasingPriceArray.find(
    (obj) => obj.strike.toString() == priceObj.price
  );
  if (!strikePriceObject) {
    strikePriceObject = activeAssetStrikes.decreasingPriceArray.find(
      (obj) => obj.strike.toString() == priceObj.price
    );
  }
  if (!strikePriceObject) return null;
  const totalFee = priceObj.isAbove
    ? strikePriceObject.totalFeeAbove
    : strikePriceObject.totalFeeBelow;
  if (!totalFee) return null;

  return {
    contracts: divide(amount, totalFee.toString()) as string,
    totalFee,
    selectedStrikeData: strikePriceObject,
    isAbove: priceObj.isAbove,
  };
};
