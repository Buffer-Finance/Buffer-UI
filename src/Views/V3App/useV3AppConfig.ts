import { useActiveChain } from '@Hooks/useActiveChain';
import useSWR from 'swr';
import { v3AppConfig } from './config';
import axios from 'axios';

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
  if (error) {
    console.log(error);
  }
  if (!data) {
    return null;
  }
  const v3AppConfig: V3AppConfig = [];
  data.forEach((item) => {});
  return v3AppConfig;
};

type V3AppConfig = {
  category: string;
  token0: string;
  token1: string;
  pools: {
    pool: string;
    max_fee: number;
    min_fee: number;
    base_settlement_fee: number;
    max_duration: string;
    min_duration: string;
    isPaused: false;
    contracts: {
      config: string;
      option: string;
    };
  };
}[];
type response = {
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

enum AssetCategory {
  Forex,
  Crypto,
  Commodities,
}
