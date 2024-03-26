import { useMarketsConfig } from '@Views/ABTradePage/Hooks/useMarketsConfig';
import { getMarketsDataReadcalls } from './getMarketsDataReadcalls';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useSettlementFee } from '@Views/ABTradePage/Hooks/useSettlementFee';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useEffect, useMemo } from 'react';
import { readResponseAtom, setReadCallsAtom } from '@Views/DashboardV2/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { getCallId } from '@Utils/Contract/multiContract';
import { joinStrings } from '@Views/ABTradePage/utils';

export const useMarketsReadCallData = () => {
  const readCallData = useAtomValue(readResponseAtom);
  const setCalls = useSetAtom(setReadCallsAtom);
  const config = useMarketsConfig();
  const { data: baseSettlementFees } = useSettlementFee();
  const referralData = useReferralCode();
  const { address } = useUserAccount();
  const { activeChain } = useActiveChain();
  const calls = getMarketsDataReadcalls(
    config,
    baseSettlementFees,
    address,
    referralData,
    activeChain?.id
  );

  useEffect(() => {
    setCalls({ readcalls: calls, activeChainId: activeChain.id });
  }, [calls.length, activeChain, address]);

  const response = useMemo(() => {
    const maxTradeSizes: { [key: string]: string } = {};

    const settlementFees: {
      [key: string]: string;
    } = {};
    const maxOIs: {
      [key: string]: string;
    } = {};
    const currentOIs: {
      [key: string]: string;
    } = {};
    const creationWindows: {
      [key: string]: boolean;
    } = {};

    if (readCallData !== null && readCallData !== undefined) {
      config?.forEach((item) => {
        item.pools.forEach((pool) => {
          maxTradeSizes[pool.optionContract] =
            readCallData[
              getCallId(pool.optionContract, 'getMaxTradeSize')
            ]?.[0];
          maxOIs[pool.optionContract] =
            readCallData[getCallId(pool.optionContract, 'getMaxOI')]?.[0];
          currentOIs[pool.optionContract] =
            readCallData[getCallId(pool.optionContract, 'totalMarketOI')]?.[0];

          const settlement_fee =
            readCallData[
              getCallId(
                pool.optionContract,
                'getSettlementFeePercentage',
                referralData[3],
                address,
                baseSettlementFees?.[
                  joinStrings(item.token0, item.token1, '')
                ]?.settlement_fee?.toString() ?? '1500'
              )
            ]?.[0];
          if (settlement_fee) {
            settlementFees[pool.optionContract] = settlement_fee;
          }

          creationWindows[pool.optionContract] = item.creation_window_contract
            ? readCallData[
                getCallId(item.creation_window_contract, 'isInCreationWindow')
              ]?.[0]
            : 'true';
        });
      });

      return {
        maxTradeSizes,
        settlementFees,
        maxOIs,
        currentOIs,
        creationWindows,
      };
    }
    return {
      maxTradeSizes,
      settlementFees,
      maxOIs,
      currentOIs,
      creationWindows,
    };
  }, [readCallData]);

  return response;
};
