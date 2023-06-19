import { useToast } from '@Contexts/Toast';
import { AssetCategory, marketType, responseObj } from '../type';
import { getTokens, secondsToHHMM } from '../utils';
import { useMarketsRequest } from './GraphqlRequests/useMarketsRequest';
import { getAddress } from 'ethers/lib/utils.js';
import { marketsForChart } from '../config';

export const useMarketsConfig = () => {
  const { data, error } = useMarketsRequest();
  const toastify = useToast();

  if (error) {
    toastify({
      type: 'error',
      msg: 'Error fetching markets. Please try again.' + error,
    });
  }
  if (!data?.optionContracts) {
    return null;
  }

  const response: marketType[] = [];
  data.optionContracts.forEach((item) => {
    const [token0, token1] = getTokens(item.asset, 'USD');
    const index = response.findIndex(
      (config) => config.token0 === token0 && config.token1 === token1
    );
    if (index !== -1) {
      response[index].pools.push(createPoolObject(item));
    } else {
      const marketInfo = (marketsForChart as any)[token0 + token1];
      response.push({
        ...marketInfo,
        category: AssetCategory[item.category],
        token0,
        token1,
        pools: [createPoolObject(item)],
      });
    }
  });

  // console.log(`DDDresponse: `, response);
  return response;
};

//creates a pool object from the response object
function createPoolObject(market: responseObj) {
  return {
    pool: getAddress(market.poolContract),
    max_fee: market.configContract.maxFee,
    min_fee: market.configContract.minFee,
    max_duration: secondsToHHMM(Number(market.configContract.maxPeriod)),
    min_duration: secondsToHHMM(Number(market.configContract.minPeriod)),
    isPaused: market.isPaused,
    configContract: getAddress(market.configContract.address),
    optionContract: getAddress(market.address),
    openInterest: market.openInterest,
    platformFee: market.configContract.platformFee,
  };
}
