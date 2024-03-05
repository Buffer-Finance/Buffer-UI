import { useActiveChain } from '@Hooks/useActiveChain';
import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import CircuitBreakerABI from '@Views/TradePage/ABIs/CircuitBreakerABI.json';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { poolInfoType, responseObj } from '@Views/TradePage/type';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useCallback, useMemo } from 'react';
import { getAddress } from 'viem';

export const useReadCallData = (markets: responseObj[] | undefined) => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const { getPoolInfo } = usePoolInfo();
  if (markets === undefined || config === undefined) return null;

  const getThresholdsCallId = useCallback(
    (marketAddress: string) => {
      return getCallId(config.cb, 'thresholds', [marketAddress]);
    },
    [config]
  );
  const getPoolAPRsCallId = useCallback(
    (poolAddress: string) => {
      return getCallId(config.cb, 'poolAPRs', [poolAddress]);
    },
    [config]
  );

  const pools = markets.map((market) => market.poolContract);
  // remove duplicates in pools
  const uniquePools = [...new Set(pools)];

  const calls = markets.map((market) => ({
    address: config.cb,
    abi: CircuitBreakerABI,
    name: 'thresholds',
    params: [market.address],
    id: getThresholdsCallId(market.address),
  }));

  const poolcalls = uniquePools.map((poolAddress) => ({
    address: config.cb,
    abi: CircuitBreakerABI,
    name: 'poolAPRs',
    params: [poolAddress],
    id: getPoolAPRsCallId(poolAddress),
  }));

  calls.push(...poolcalls);
  const { data: response } = useCall2Data(calls, 'getAllMarketsData');

  const returnData = useMemo(() => {
    if (response === null || response === undefined) return null;
    const data: {
      pools: (poolInfoType & { apr: string; address: string })[];
      markets: (responseObj & { threshold: string })[];
    } = { pools: [], markets: [] };

    Object.entries(response).forEach(([key, value]) => {
      if (key.includes('poolAPRs')) {
        const poolAddress = getAddress(key.split('poolAPRs')[1]);

        const poolInfo = getPoolInfo(poolAddress);
        data.pools.push({
          ...poolInfo,
          apr: value,
          address: poolAddress,
        });
      } else if (key.includes('thresholds')) {
        data.markets.push({
          ...markets.find((market) => key.includes(market.address)),
          threshold: value,
        });
      }
    });
    return data;
  }, [response]);

  return {
    readcallData: returnData,
    getThresholdsCallId,
    getPoolAPRsCallId,
  };
};
