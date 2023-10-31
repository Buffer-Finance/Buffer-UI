import { useMemo } from 'react';
import { getAddress } from 'viem';
import { marketsForChart } from '../config';
import { AssetCategory, chartDataType, marketType, responseObj } from '../type';
import { secondsToHHMM } from '../utils';
import { useMarketsRequest } from './GraphqlRequests/useMarketsRequest';

export const useMarketsConfig = () => {
  const { data, error } = useMarketsRequest();
  // console.log(`data: `, data);
  const res = useMemo(() => {
    if (!data?.optionContracts) {
      return null;
    }

    const response: marketType[] = [];
    data.optionContracts.forEach((item) => {
      const index = response.findIndex((config) => config.tv_id === item.asset);
      // console.log(`item: `, item/);
      if (index !== -1) {
        response[index].pools.push(createPoolObject(item));
      } else {
        const marketInfo: chartDataType =
          marketsForChart[item.asset as keyof typeof marketsForChart];
        response.push({
          ...marketInfo,
          category: AssetCategory[item.category],
          creation_window_contract: item.configContract.creationWindowAddress,
          pools: [createPoolObject(item)],
        });
      }
    });

    // console.log(`DDDresponse: `, response);
    // console.log(`response: `, response);
    return response;
  }, [data]);
  // console.log(`res: `, res);
  return res;
};

//creates a pool object from the response object
export function createPoolObject(market: responseObj) {
  return {
    pool: getAddress(market.poolContract),
    max_fee: market.configContract.maxFee,
    min_fee: market.configContract.minFee,
    max_duration: secondsToHHMM(Number(market.configContract.maxPeriod)),
    min_duration: secondsToHHMM(Number(market.configContract.minPeriod)),
    isPaused: market.isPaused,
    configContract: getAddress(market.configContract.address),
    optionContract: getAddress(market.address),
    marketOiContract: getAddress(market.configContract.marketOIaddress),
    poolOIContract: getAddress(market.configContract.poolOIaddress),
    platformFee: market.configContract.platformFee,
    earlyclose: {
      enable: market.configContract.isEarlyCloseEnabled,
      threshold: market.configContract.earlyCloseThreshold,
    },
    IV: Number(market.configContract.IV),
    IVFactorOTM: Number(market.configContract.IVFactorOTM),
    IVFactorITM: Number(market.configContract.IVFactorITM),
    SpreadConfig1: Number(market.configContract.SpreadConfig1),
    SpreadConfig2: Number(market.configContract.SpreadConfig2),
    SpreadFactor: Number(market.configContract.SpreadFactor),
  };
}
