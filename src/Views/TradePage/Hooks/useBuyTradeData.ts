import { useActiveChain } from '@Hooks/useActiveChain';
import { useBuyTradePageReadcalls } from './Readcalls/useBuyPageReadcalls';
import { useSwitchPool } from './useSwitchPool';
import { appConfig } from '../config';
import { useMemo } from 'react';
import { getCallId } from '@Utils/Contract/multiContract';
import { useMarketsConfig } from './useMarketsConfig';
import { getPayout } from '../utils';

export const useBuyTradeData = (deb?: string) => {
  const { data: readCallData } = useBuyTradePageReadcalls();
  const { switchPool, poolDetails } = useSwitchPool();
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const config = useMarketsConfig();
  console.log('readCallData', readCallData);
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
    const user2signer = {
      signer: readCallData[getCallId(configData.router, 'accountMapping')]?.[0],
      nonce: readCallData[getCallId(configData.router, 'accountMapping')]?.[1],
    };
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
      });
    });
    const isInCreationWindow =
      readCallData[
        getCallId(configData.creation_window, 'isInCreationWindow')
      ]?.[0];

    return {
      balance,
      allowance,
      user2signer,
      maxTradeSizes,
      settlementFees,
      maxOIs,
      currentOIs,
      isInCreationWindow,
    };
  }, [readCallData, poolDetails, switchPool, configData]);

  return response;
};
