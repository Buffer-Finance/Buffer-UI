import { useToast } from '@Contexts/Toast';
import { AssetCategory, chartDataType, marketType, responseObj } from '../type';
import { getTokens, secondsToHHMM } from '../utils';
import { useMarketsRequest } from './GraphqlRequests/useMarketsRequest';
import { getAddress } from 'ethers/lib/utils.js';
import { appConfig, marketsForChart } from '../config';
import { useActiveChain } from '@Hooks/useActiveChain';

export const useMarketsConfig = () => {
  const { data, error } = useMarketsRequest();
  const toastify = useToast();
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

  if (error) {
    toastify({
      type: 'error',
      msg: 'Error fetching markets. Please try again.' + error,
      id: 'fetchMarketAPI',
    });
  }
  if (!data?.optionContracts) {
    return null;
  }

  const response: marketType[] = [];
  data.optionContracts.forEach((item) => {
    if (
      Object.keys(configData.poolsInfo).find(
        (poolCOntract) => getAddress(item.poolContract) == poolCOntract
      ) === undefined
    ) {
      return;
    }
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
    marketOiContract: getAddress(market.configContract.marketOIaddress),
    platformFee: market.configContract.platformFee,
    earlyclose: {
      enable: market.configContract.isEarlyCloseEnabled,
      threshold: market.configContract.earlyCloseThreshold,
    },
  };
}
