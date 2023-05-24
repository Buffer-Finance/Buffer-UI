import { useActiveChain } from '@Hooks/useActiveChain';
import useSWR from 'swr';
import { v3AppConfig } from './config';
import axios from 'axios';
import {
  getMaximumValue,
  getPayout,
  getTokens,
  secondsToHHMM,
} from './helperFns';

const useFetchV3AppConfig = () => {
  const { activeChain } = useActiveChain();
  const configData = v3AppConfig[activeChain.id];

  async function fetcher(): Promise<response> {
    const response = await axios.post(configData.graph.MAIN, {
      query: `{ 
            optionContracts {
                configContract {
                  address
                  baseSettlementFeeForAbove
                  baseSettlementFeeForBelow
                  maxFee
                  maxPeriod
                  minFee
                  minPeriod
                }
                address
                poolContract
                isPaused
                category
                asset
              }
          }`,
    });
    return response.data?.data as response;
  }

  return useSWR<response, Error>('v3AppConfig', {
    fetcher: fetcher,
  });
};

export const useV3AppConfig = () => {
  const { data, error } = useFetchV3AppConfig();
  console.log(data, 'data');
  if (error) {
    console.log(error);
  }
  if (!data?.optionContracts) {
    return null;
  }
  const v3AppConfig: V3AppConfig[] = [];
  data.optionContracts.forEach((item) => {
    const [token0, token1] = getTokens(item.asset, 'USD');
    const index = v3AppConfig.findIndex(
      (config) => config.token0 === token0 && config.token1 === token1
    );
    if (index !== -1) {
      v3AppConfig[index].pools.push({
        pool: item.poolContract,
        max_fee: item.configContract.maxFee,
        min_fee: item.configContract.minFee,
        base_settlement_fee: getPayout(
          getMaximumValue(
            item.configContract.baseSettlementFeeForAbove,
            item.configContract.baseSettlementFeeForBelow
          )
        ),
        max_duration: secondsToHHMM(Number(item.configContract.maxPeriod)),
        min_duration: secondsToHHMM(Number(item.configContract.minPeriod)),
        isPaused: item.isPaused,
        configContract: item.configContract.address,
        optionContract: item.address,
      });
    } else {
      v3AppConfig.push({
        category: AssetCategory[item.category],
        token0,
        token1,
        pools: [
          {
            pool: item.poolContract,
            max_fee: item.configContract.maxFee,
            min_fee: item.configContract.minFee,
            base_settlement_fee: getPayout(
              getMaximumValue(
                item.configContract.baseSettlementFeeForAbove,
                item.configContract.baseSettlementFeeForBelow
              )
            ),
            max_duration: secondsToHHMM(Number(item.configContract.maxPeriod)),
            min_duration: secondsToHHMM(Number(item.configContract.minPeriod)),
            isPaused: item.isPaused,
            configContract: item.configContract.address,
            optionContract: item.address,
          },
        ],
      });
    }
  });
  return v3AppConfig;
};
export type V3AppConfig = {
  category: string;
  token0: string;
  token1: string;
  pools: {
    pool: string;
    max_fee: string;
    min_fee: string;
    base_settlement_fee: string;
    max_duration: string;
    min_duration: string;
    isPaused: boolean;
    configContract: string;
    optionContract: string;
  }[];
};
type response = {
  optionContracts: {
    configContract: {
      address: string;
      baseSettlementFeeForAbove: string;
      baseSettlementFeeForBelow: string;
      maxFee: string;
      maxPeriod: string;
      minFee: string;
      minPeriod: string;
    };
    address: string;
    poolContract: string;
    isPaused: boolean;
    category: number;
    asset: string;
  }[];
};

enum AssetCategory {
  Forex,
  Crypto,
  Commodities,
}
