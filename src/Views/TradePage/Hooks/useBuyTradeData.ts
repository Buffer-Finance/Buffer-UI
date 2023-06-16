import { useActiveChain } from '@Hooks/useActiveChain';
import { useBuyTradePageReadcalls } from './Readcalls/useBuyPageReadcalls';
import { useSwitchPool } from './useSwitchPool';
import { appConfig } from '../config';
import { useMemo } from 'react';
import { getCallId } from '@Utils/Contract/multiContract';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useMarketsConfig } from './useMarketsConfig';

export const useBuyTradeData = (deb?: string) => {
  const { data: readCallData } = useBuyTradePageReadcalls();
  const { switchPool, poolDetails } = useSwitchPool();
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const config = useMarketsConfig();

  const response = useMemo(() => {
    if (
      !readCallData ||
      !poolDetails ||
      !switchPool ||
      Object.entries(readCallData).length === 0
    ) {
      return null;
    }
    // const payout = readCallData[getCallId(poolDetails.meta, 'getPayout')]?.[0];
    const balance =
      readCallData[getCallId(poolDetails.tokenAddress, 'balanceOf')]?.[0];
    const allowance =
      readCallData[getCallId(poolDetails.tokenAddress, 'allowance')]?.[0];
    const user2signer = {
      signer: readCallData[getCallId(configData.router, 'accountMapping')]?.[0],
      nonce: readCallData[getCallId(configData.router, 'accountMapping')]?.[1],
    };
    const maxTradeSizes: { [key: string]: string } = {};

    config?.forEach((item) => {
      item.pools.forEach((pool) => {
        maxTradeSizes[pool.optionContract] =
          readCallData[getCallId(pool.optionContract, 'getMaxTradeSize')]?.[0];
      });
    });

    // console.log('maxTradeSizes', maxTradeSizes);

    return {
      balance,
      allowance,
      user2signer,
      maxTradeSizes,
    };
  }, [readCallData, poolDetails, switchPool, configData]);

  return response;
};
