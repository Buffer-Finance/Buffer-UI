import { useActiveChain } from '@Hooks/useActiveChain';
import { getCallId } from '@Utils/Contract/multiContract';
import { readResponseAtom, setReadCallsAtom } from '@Views/DashboardV2/atoms';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';
import { appConfig } from '@Views/TradePage/config';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getABLPreadcalls } from './getABLPreadcalls';

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
      activeChainId: activeChain.id,
    });
  }, [calls.length, activeChain]);

  if (!!response) {
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
