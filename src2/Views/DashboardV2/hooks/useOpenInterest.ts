import { useActiveChain } from '@Hooks/useActiveChain';
import { add } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useMarketsRequest } from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { appConfig } from '@Views/TradePage/config';
import { responseObj } from '@Views/TradePage/type';
import { getAddress } from 'ethers/lib/utils.js';
import { useMemo } from 'react';
import { useMarketsReadCallData } from './useMarketsData/useMarketsReadcallData';

export const useOpenInterest = () => {
  const { currentOIs } = useMarketsReadCallData();
  const { marketContractsByPool } = useMarketContractsByPool();
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];

  //currentOIs is an object of key value pairs where the key is the market address and the value is the open interest for that market; marketContractsByPool is an object of key value pairs where the key is the pool address and the value is an array of market objects that belong to that pool; we want to return an object of key value pairs where the key is the pool address and the value is the sum of the open interest of all the markets that belong to that pool

  const openInterestByPool = useMemo(() => {
    if (!currentOIs || !marketContractsByPool || !config) return null;
    const result: {
      [key: string]: string;
    } = {};
    Object.keys(marketContractsByPool).forEach((poolAddress) => {
      const markets = marketContractsByPool[poolAddress];
      const openInterestSum = markets.reduce((acc, market) => {
        const marketAddress = getAddress(market.address);
        const openInterest = currentOIs[marketAddress];
        if (openInterest === undefined) return acc;
        return add(
          acc,
          fromWei(
            openInterest,
            config.poolsInfo[poolAddress as keyof typeof config.poolsInfo]
              .decimals
          )
        );
      }, '0');
      result[poolAddress] = openInterestSum;
    });
    return result;
  }, [currentOIs, marketContractsByPool]);

  // console.log('openInterestByPool', openInterestByPool);

  return { openInterestByPool };
};

export const useMarketContractsByPool = () => {
  const { data } = useMarketsRequest();

  const marketContractsByPool = useMemo(() => {
    if (!data.optionContracts) return null;
    const result: {
      [key: string]: responseObj[];
    } = {};
    data.optionContracts.forEach((item) => {
      const poolAddress = getAddress(item.poolContract);
      if (!result[poolAddress]) {
        result[poolAddress] = [];
      }
      result[poolAddress].push(item);
    });
    return result;
  }, [data]);

  return { marketContractsByPool };
};
