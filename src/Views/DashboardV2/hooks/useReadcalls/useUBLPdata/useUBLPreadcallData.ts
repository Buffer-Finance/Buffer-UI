import { useActiveChain } from '@Hooks/useActiveChain';
import { getCallId } from '@Utils/Contract/multiContract';
import { readResponseAtom, setReadCallsAtom } from '@Views/DashboardV2/atoms';
import { usePoolByAsset } from '@Views/ABTradePage/Hooks/usePoolByAsset';
import { appConfig } from '@Views/ABTradePage/config';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getUBLPreadcalls } from './getUBLPreadcalls';

export const useUBLPreadcallData = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const pools = usePoolByAsset();
  const usdcPool = pools['USDC'];
  const calls = getUBLPreadcalls(activeChain.id);
  const setCalls = useSetAtom(setReadCallsAtom);
  const response = useAtomValue(readResponseAtom);

  useEffect(() => {
    setCalls({
      readcalls: calls,
      activeChainId: activeChain.id,
    });
  }, [calls.length, activeChain]);

  if (!!response) {
    const blpTotalBalance =
      response[
        getCallId('totalTokenXBalance', config.EarnConfig.BLP, activeChain.id)
      ]?.[0];
    const blpSupply =
      response[
        getCallId('totalSupply', config.EarnConfig.BLP, activeChain.id)
      ]?.[0];
    const blpInitialRate =
      response[
        getCallId('INITIAL_RATE', config.EarnConfig.BLP, activeChain.id)
      ]?.[0];
    const totalStakedBLP =
      response[
        getCallId(
          'balanceOf',
          config.EarnConfig.BLP,
          activeChain.id,
          config.EarnConfig.FeeBlpTracker
        )
      ]?.[0];
    const totalSupplyBLP =
      response[
        getCallId('totalSupply', config.EarnConfig.BLP, activeChain.id)
      ]?.[0];
    const feeBlpTrackerTokensPerInterval =
      response[
        getCallId(
          'tokensPerInterval',
          config.EarnConfig.FeeBlpTracker,
          activeChain.id
        )
      ]?.[0];
    const stakedBlpTrackerTokensPerInterval =
      response[
        getCallId(
          'tokensPerInterval',
          config.EarnConfig.StakedBlpTracker,
          activeChain.id
        )
      ]?.[0];
    const USDCvaultPOL =
      response[
        getCallId(
          'depositBalances',
          config.EarnConfig.StakedBlpTracker,
          activeChain.id,
          config.DashboardConfig.usdcLiquidityAddress,
          config.EarnConfig.FeeBlpTracker
        )
      ]?.[0];
    const amountUSDCpool =
      response[
        getCallId(
          'balanceOf',
          usdcPool.tokenAddress,
          activeChain.id,
          usdcPool.poolAddress
        )
      ]?.[0];

    return {
      blpTotalBalance,
      blpSupply,
      blpInitialRate,
      totalStakedBLP,
      totalSupplyBLP,
      feeBlpTrackerTokensPerInterval,
      stakedBlpTrackerTokensPerInterval,
      USDCvaultPOL,
      amountUSDCpool,
    };
  }
  return null;
};
