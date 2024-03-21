import { useMemo } from 'react';
import { marketsForChart } from '../config';
import { AssetCategory, chartDataType, marketType } from '../type';
import { getTokens } from '../utils';
import { useAllV2_5MarketsRequest } from './GraphqlRequests/useMarketsRequest';
import { createPoolObject } from './useMarketsConfig';

export const useAllV2_5MarketsConfig = () => {
  const { data, error } = useAllV2_5MarketsRequest();
  // console.log(`data: `, data);
  const res = useMemo(() => {
    if (!data?.optionContracts) {
      return null;
    }

    const response: marketType[] = [];
    data.optionContracts.forEach((item) => {
      const [token0, token1] = getTokens(item.asset, 'USD');
      const index = response.findIndex(
        (config) => config.token0 === token0 && config.token1 === token1
      );
      // console.log(`item: `, item/);
      if (index !== -1) {
        response[index].pools.push(createPoolObject(item));
      } else {
        const marketInfo: chartDataType =
          marketsForChart[item.asset as keyof typeof marketsForChart];
        response.push({
          ...marketInfo,
          category: AssetCategory[item.category],
          // creation_window_contract: item.configContract.creationWindowAddress,
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
