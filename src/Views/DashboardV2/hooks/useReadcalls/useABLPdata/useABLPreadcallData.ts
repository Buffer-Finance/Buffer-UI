import { readResponseAtom, setReadCallsAtom } from '@Views/DashboardV2/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getABLPreadcalls } from './getABLPreadcalls';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';
import { appConfig } from '@Views/TradePage/config';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getCallId } from '@Utils/Contract/multiContract';

export const useABLPreadcallData = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const pools = usePoolByAsset();
  const arbPool = pools['ARB'];
  const calls = getABLPreadcalls(activeChain.id);
  const setCalls = useSetAtom(setReadCallsAtom);
  const response = useAtomValue(readResponseAtom);

  useEffect(() => {
    setCalls({
      readcalls: calls,
      isCleanup: false,
    });

    return () => {
      setCalls({
        readcalls: calls,
        isCleanup: true,
      });
    };
  }, [calls.length, activeChain]);

  if (response !== undefined) {
    const ablpTotalBalance =
      response[
        getCallId('totalTokenXBalance', arbPool.poolAddress, activeChain.id)
      ];
    const ablpSupply =
      response[getCallId('totalSupply', arbPool.poolAddress, activeChain.id)];
    const ablpInitialRate =
      response[getCallId('INITIAL_RATE', arbPool.poolAddress, activeChain.id)];
    const amountARBpool =
      response[
        getCallId(
          'balanceOf',
          arbPool.tokenAddress,
          activeChain.id,
          arbPool.poolAddress
        )
      ];
    const stakedArbBlpTrackerTokensPerInterval =
      response[
        getCallId(
          'tokensPerInterval',
          config.EarnConfig.StakedBlpTracker2,
          activeChain.id
        )
      ];
    const feeArbBlpTrackerTokensPerInterval =
      response[
        getCallId(
          'tokensPerInterval',
          config.EarnConfig.FeeBlpTracker2,
          activeChain.id
        )
      ];
    const ARBvaultPOL =
      response[
        getCallId(
          'depositBalances',
          config.EarnConfig.StakedBlpTracker2,
          activeChain.id,
          config.DashboardConfig.usdcLiquidityAddress,
          config.EarnConfig.FeeBlpTracker2
        )
      ];
    return {
      ablpTotalBalance,
      ablpSupply,
      ablpInitialRate,
      amountARBpool,
      stakedArbBlpTrackerTokensPerInterval,
      feeArbBlpTrackerTokensPerInterval,
      ARBvaultPOL,
    };
  }
  return null;
};
