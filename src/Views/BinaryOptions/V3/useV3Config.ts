import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { v3Config } from './v3Config';

export const useNoLossStaticConfig = () => {
  const { activeChain } = useActiveChain();
  const data = useMemo(() => {
    //FIXME - add activewChain and think of edge cases.
    const chainId = activeChain.id;
    const allConfig = v3Config['421613'];
    return {
      chainId,
      ...allConfig,
    };
  }, [activeChain.id]);
  return data;
};

const useV3Config = () => {
  const config = useNoLossStaticConfig();

  async function fetcher() {
    const basicQuery = `
  optionContracts(first: 1000) {
    configContract {
      address
      maxPeriod
      maxFee
      minFee
      minPeriod
      baseSettlementFeeForAbove
      baseSettlementFeeForBelow
    }
    address
    asset
    isPaused
    currentUtilization
    token
    pool
    tradeCount
    volume
    payoutForUp
    payoutForDown
    openUp
    openInterest
    openDown
  }
  `;
    const response = await axios.post(config.graph.MAIN, {
      query: `{${basicQuery}}`,
    });
    return response.data.data.optionContracts.reduce(
      (
        acc: {
          [key: string]: V3ConfigInterface & V3OptionInterface & addedConfig;
        },

        option: V3ConfigResponse
      ) => {
        //update the pool list if an asset comes more tahn once
        if (acc[option.asset]) {
          acc[option.asset].pools.push(option.pool);
        } else {
          acc[option.asset] = {
            ...option.configContract,
            configAddress: option.configContract?.address,
            ...option,
            pools: [option.pool],
          };
        }

        return acc;
      },
      {}
    );
  }

  return useSWR<Promise<V3Config>>(`config-root-config-${config.chainId}`, {
    fetcher,
    refreshInterval: 100000,
  });
};

export { useV3Config };

export interface V3ConfigInterface {
  address: string;
  maxPeriod: string;
  maxFee: string;
  minFee: string;
  minPeriod: string;
  baseSettlementFeeForAbove: string;
  baseSettlementFeeForBelow: string;
}

export interface V3OptionInterface {
  address: string;
  asset: string;
  isPaused: boolean;
  currentUtilization: string;
  token: string;
  pool: string;
  tradeCount: number;
  volume: string;
  payoutForUp: string;
  payoutForDown: string;
  openUp: string;
  openInterest: string;
  openDown: string;
}

export interface V3Config {
  [key: string]: V3ConfigInterface & V3OptionInterface & addedConfig;
}

interface addedConfig {
  configAddress: string;
  pools: string[];
}

type V3ConfigResponse = {
  configContract: V3ConfigInterface;
} & V3OptionInterface;
