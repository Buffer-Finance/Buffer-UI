import { useActiveChain } from '@Hooks/useActiveChain';
import { getCallId } from '@Utils/Contract/multiContract';
import { atom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { getPayout } from '../utils';
import { getConfig } from '../utils/getConfig';
import { useBuyTradePageReadcalls } from './Readcalls/useBuyPageReadcalls';
import { useMarketsConfig } from './useMarketsConfig';
import { useSwitchPool } from './useSwitchPool';

export const buyTradeDataAtom = atom<{
  balance: string;
  allowance: string;
  // user2signer: { signer: string; nonce: string };
  maxTradeSizes: { [key: string]: string };
  settlementFees: { [key: string]: string };
  maxOIs: { [key: string]: string };
  currentOIs: { [key: string]: string };
  nonces: string;
  creationWindows: { [key: string]: boolean };
} | null>(null);

export const useBuyTradeData = (deb?: string) => {
  const { data: readCallData } = useBuyTradePageReadcalls();
  const { switchPool, poolDetails } = useSwitchPool();
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const config = useMarketsConfig();
  const setBuyTradeData = useSetAtom(buyTradeDataAtom);
  const response = useMemo(() => {
    if (
      !readCallData ||
      !poolDetails ||
      !switchPool ||
      Object.entries(readCallData).length === 0
    ) {
      return null;
    }
    const balance =
      readCallData[getCallId(poolDetails.tokenAddress, 'balanceOf')]?.[0];

    const allowance =
      readCallData[getCallId(poolDetails.tokenAddress, 'allowance')]?.[0];
    // const user2signer = {
    //   signer:
    //     readCallData[
    //       getCallId(configData.signer_manager, 'accountMapping')
    //     ]?.[0],
    //   nonce:
    //     readCallData[
    //       getCallId(configData.signer_manager, 'accountMapping')
    //     ]?.[1],
    // };
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

    config?.forEach((item) => {
      item.pools.forEach((pool) => {
        maxTradeSizes[pool.optionContract] =
          readCallData[getCallId(pool.optionContract, 'getMaxTradeSize')]?.[0];
        maxOIs[pool.optionContract] =
          readCallData[getCallId(pool.optionContract, 'getMaxOI')]?.[0];
        currentOIs[pool.optionContract] =
          readCallData[getCallId(pool.optionContract, 'totalMarketOI')]?.[0];

        const settlement_fee =
          readCallData[
            getCallId(pool.optionContract, 'getSettlementFeePercentage')
          ]?.[0];
        if (settlement_fee) {
          settlementFees[pool.optionContract] = getPayout(settlement_fee);
        }

        creationWindows[pool.optionContract] = item.creation_window_contract
          ? readCallData[
              getCallId(item.creation_window_contract, 'isInCreationWindow')
            ]?.[0]
          : 'true';
      });
    });
    // const isInCreationWindow =
    //   readCallData[
    //     getCallId(configData.creation_window, 'isInCreationWindow')
    //   ]?.[0];
    const nonces =
      readCallData[getCallId(poolDetails.tokenAddress, 'nonces')]?.[0];

    setBuyTradeData({
      balance,
      allowance,
      // user2signer,
      maxTradeSizes,
      settlementFees,
      maxOIs,
      currentOIs,
      nonces,
      creationWindows,
    });
  }, [readCallData, poolDetails, switchPool, configData]);
};
