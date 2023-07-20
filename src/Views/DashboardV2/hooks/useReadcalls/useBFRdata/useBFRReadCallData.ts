import { useActiveChain } from '@Hooks/useActiveChain';
import { readResponseAtom, setReadCallsAtom } from '@Views/DashboardV2/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getArbitrumBFRreadcalls } from './getArbitrumBFRreadcalls';
import { getCallId } from '@Utils/Contract/multiContract';
import { appConfig } from '@Views/TradePage/config';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';

export const useBFRReadCallData = () => {
  const response = useAtomValue(readResponseAtom);
  const setCalls = useSetAtom(setReadCallsAtom);
  const { activeChain } = useActiveChain();
  const poolsByAsset = usePoolByAsset();
  const readcalls = getArbitrumBFRreadcalls(
    activeChain.id,
    poolsByAsset['BFR'].poolAddress
  );
  const { EarnConfig } =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

  useEffect(() => {
    setCalls({ readcalls, isCleanup: false });

    return () => {
      setCalls({ readcalls, isCleanup: true });
    };
  }, [readcalls.length, activeChain]);

  if (response !== null && response !== undefined) {
    const totalStakedBFR =
      response[
        getCallId(
          EarnConfig.iBFR,
          'balanceOf',
          activeChain.id,
          EarnConfig.StakedBfrTracker
        )
      ]?.[0];
    const totalSupplyBFR =
      response[getCallId(EarnConfig.iBFR, 'totalSupply', activeChain.id)]?.[0];
    const burnBFRAmount =
      response[
        getCallId(
          EarnConfig.iBFR,
          'balanceOf',
          activeChain.id,
          EarnConfig.burnAddress
        )
      ]?.[0];
    const bfrPoolBalance =
      response[
        getCallId(
          EarnConfig.iBFR,
          'balanceOf',
          activeChain.id,
          poolsByAsset['BFR'].poolAddress
        )
      ]?.[0];

    return {
      totalStakedBFR,
      totalSupplyBFR,
      burnBFRAmount,
      bfrPoolBalance,
    };
  }
};
