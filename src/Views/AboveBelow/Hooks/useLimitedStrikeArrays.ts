import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { useCurrentPrice } from '@Views/ABTradePage/Hooks/useCurrentPrice';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { getAddress } from 'viem';
import { getRoundedPrice } from '../Components/BuyTrade/PriceTable/helpers';
import { selectedExpiry, selectedPoolActiveMarketAtom } from '../atoms';
import { useIV } from './useIV';
import { useSettlementFee } from './useSettlementFee';
export type strikePriceObjectType = {
  strike: number;
  totalFeeAbove: number | null;
  totalFeeBelow: number | null;
  baseFeeAbove: number;
  baseFeeBelow: number;
  marketID: string;
};
export const strikePrices: {
  [activeAsset: string]: {
    decreasingPriceArray: strikePriceObjectType[];
    increasingPriceArray: strikePriceObjectType[];
  };
} = {};

export const useLimitedStrikeArrays = () => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const [timestamp, setTimestamp] = useState(0);
  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const expiration = useAtomValue(selectedExpiry);
  const { data: ivs } = useIV();
  const { data: settlementFees } = useSettlementFee();

  const stepFromConfig = activeMarket?.configContract.stepSize;
  const stepsize =
    stepFromConfig === undefined
      ? undefined
      : divide(activeMarket?.configContract.stepSize ?? '0', 8) ?? '0';
  const roundedPrice =
    stepsize === undefined ? 0 : getRoundedPrice(+currentPrice, +stepsize);

  useEffect(() => {
    //rereun after every 10 seconds
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      activeMarket === undefined ||
      expiration === undefined ||
      !settlementFees ||
      stepsize === undefined ||
      roundedPrice === 0
    ) {
      console.log('debug', 'activeMarket', activeMarket);
      console.log('debug', 'expiration', expiration);
      console.log('debug', 'settlementFees', settlementFees);
      console.log('debug', 'stepsize', stepsize);
      console.log('debug', 'roundedPrice', roundedPrice);
      return;
    }
    const iv = ivs?.[activeMarket.tv_id];
    if (iv === undefined) return;

    const currentEpoch = Math.floor(Date.now() / 1000);
    const decreasingPriceArray: strikePriceObjectType[] = [];
    const increasingPriceArray: strikePriceObjectType[] = [];
    let i = 0;
    let j = 0;
    while (true) {
      const startPrice =
        roundedPrice > currentPrice ? roundedPrice - +stepsize : roundedPrice;
      const strikePrice = startPrice - i * +stepsize;
      const marketHash = solidityKeccak256(
        ['uint256', 'uint256'],
        [
          toFixed(multiply(strikePrice.toString(), 8), 0),
          Math.floor(expiration / 1000),
        ]
      );

      const settlementFeeAbove =
        settlementFees[marketHash + '-' + getAddress(activeMarket.address)]
          ?.sf_above ?? settlementFees['Base'];
      const aboveProbability = BlackScholes(
        true,
        true,
        currentPrice,
        strikePrice,
        Math.floor(expiration / 1000) - currentEpoch,
        0,
        iv / 1e4
      );
      let totalFeeAbove: number | null =
        aboveProbability + (settlementFeeAbove / 1e4) * aboveProbability;

      if (totalFeeAbove > 0.95) totalFeeAbove = null;
      const belowProbability = BlackScholes(
        true,
        false,
        currentPrice,
        strikePrice,
        Math.floor(expiration / 1000) - currentEpoch,
        0,
        iv / 1e4
      );

      const settlementFeeBelow =
        settlementFees[marketHash + '-' + getAddress(activeMarket.address)]
          ?.sf_below ?? settlementFees['Base'];

      let totalFeeBelow: number | null =
        belowProbability + (settlementFeeBelow / 1e4) * belowProbability;
      if (totalFeeBelow < 0.05) totalFeeBelow = null;
      if (totalFeeAbove === null && totalFeeBelow === null) break;
      decreasingPriceArray.push({
        strike: strikePrice,
        totalFeeAbove,
        totalFeeBelow,
        baseFeeAbove: aboveProbability,
        baseFeeBelow: belowProbability,
        marketID: marketHash,
      });

      i++;
    }

    while (true) {
      const startPrice =
        roundedPrice < currentPrice ? roundedPrice + +stepsize : roundedPrice;
      const strikePrice = startPrice + j * +stepsize;
      const marketHash = solidityKeccak256(
        ['uint256', 'uint256'],
        [
          toFixed(multiply(strikePrice.toString(), 8), 0),
          Math.floor(expiration / 1000),
        ]
      );
      const settlementFeeAbove =
        settlementFees[marketHash + '-' + getAddress(activeMarket.address)]
          ?.sf_above ?? settlementFees['Base'];
      const aboveProbability = BlackScholes(
        true,
        true,
        currentPrice,
        strikePrice,
        Math.floor(expiration / 1000) - currentEpoch,
        0,
        iv / 1e4
      );
      let totalFeeAbove: number | null =
        aboveProbability + (settlementFeeAbove / 1e4) * aboveProbability;
      i++;

      if (totalFeeAbove < 0.05) totalFeeAbove = null;
      const belowProbability = BlackScholes(
        true,
        false,
        currentPrice,
        strikePrice,
        Math.floor(expiration / 1000) - currentEpoch,
        0,
        iv / 1e4
      );
      const settlementFeeBelow =
        settlementFees[marketHash + '-' + getAddress(activeMarket.address)]
          ?.sf_below ?? settlementFees['Base'];
      let totalFeeBelow: number | null =
        belowProbability + (settlementFeeBelow / 1e4) * belowProbability;
      if (totalFeeBelow > 0.95) totalFeeBelow = null;
      if (totalFeeAbove === null && totalFeeBelow === null) break;
      increasingPriceArray.push({
        strike: strikePrice,
        totalFeeAbove,
        totalFeeBelow,
        baseFeeAbove: aboveProbability,
        baseFeeBelow: belowProbability,
        marketID: marketHash,
      });
      j++;
    }
    console.log(`increasingPriceArray: `, increasingPriceArray);
    if (strikePrices[activeMarket.tv_id] === undefined) {
      strikePrices[activeMarket.tv_id] = {
        decreasingPriceArray: [],
        increasingPriceArray: [],
      };
    }
    strikePrices[activeMarket.tv_id].decreasingPriceArray =
      decreasingPriceArray;
    strikePrices[activeMarket.tv_id].increasingPriceArray =
      increasingPriceArray.reverse();
  }, [roundedPrice, timestamp, activeMarket, expiration, settlementFees, ivs]);
};
