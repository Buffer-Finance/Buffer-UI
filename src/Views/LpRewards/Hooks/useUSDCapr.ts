import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { useMemo } from 'react';
import { Chain } from 'viem';
import { poolsType } from '../types';
import { useBlpRate } from './useBlpRate';
import { useTokensPerInterval } from './useTokensPerInterval';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';
const usd_decimals = 6;

export const useUSDCapr = (activeChain: Chain, activePool: poolsType) => {
  const { data: tokensPerInterval, error: tokensPerIntervalError } =
    useTokensPerInterval(activeChain);
  const { data: blpData, error: blpError } = useBlpRate(
    activeChain,
    activePool
  );

  return useMemo(() => {
    if (tokensPerIntervalError || blpError) return undefined;
    if (!tokensPerInterval || !blpData) return undefined;
    const blpSupply = blpData.blpAmount;
    const blpPrice = divide(blpData.price ?? '0', 8) as string;
    const feeBlpTrackerAnnualRewardsUsd = divide(
      multiply(tokensPerInterval.usdcPerInterval[0].amount, SECONDS_PER_YEAR),
      usd_decimals
    ) as string;
    const blpAprForRewardToken = gt(blpSupply, '0')
      ? (divide(
          multiply(feeBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
          divide(multiply(blpSupply, blpPrice), usd_decimals) as string
        ) as string)
      : '0';
    return blpAprForRewardToken;
  }, [
    tokensPerInterval,
    tokensPerIntervalError,
    activePool,
    activeChain,
    blpData,
    blpError,
  ]);
};
