import { useActiveChain } from '@Hooks/useActiveChain';
import { getOtherChainBLPcalls } from './getOtherChainBLPcalls';
import { useAtomValue, useSetAtom } from 'jotai';
import { readResponseAtom, setReadCallsAtom } from '@Views/DashboardV2/atoms';
import { useEffect } from 'react';
import { getCallId } from '@Utils/Contract/multiContract';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';

export const useReadCallData = () => {
  const { activeChain } = useActiveChain();
  const pools = usePoolByAsset();
  const usdcPool = pools['USDC'];
  const calls = getOtherChainBLPcalls(usdcPool);
  const setCalls = useSetAtom(setReadCallsAtom);
  const response = useAtomValue(readResponseAtom);

  useEffect(() => {
    setCalls({ readcalls: calls, activeChainId: activeChain.id });
  }, [activeChain, calls.length]);

  if (response) {
    const blpTotalBalance =
      response[getCallId(usdcPool.poolAddress, 'totalTokenXBalance')]?.[0];
    const blpSupply =
      response[getCallId(usdcPool.poolAddress, 'totalSupply')]?.[0];
    const blpInitialRate =
      response[getCallId(usdcPool.poolAddress, 'INITIAL_RATE')]?.[0];
    const amountUSDCpool =
      response[
        getCallId(usdcPool.tokenAddress, 'balanceOf', usdcPool.poolAddress)
      ]?.[0];

    return {
      blpTotalBalance,
      blpSupply,
      blpInitialRate,
      amountUSDCpool,
    };
  }
  return null;
};
