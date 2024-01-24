import { useActiveChain } from '@Hooks/useActiveChain';
import { marketsForChart } from '@Views/TradePage/config';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import useSWR from 'swr';
import { getAddress } from 'viem';
import { aboveBelowmarketsSetterAtom } from '../atoms';
import { marketTypeAB, responseAB } from '../types';

//fetches all markets from graphql
export const useAboveBelowMarketsSetter = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const setMarkets = useSetAtom(aboveBelowmarketsSetterAtom);

  async function fetcher(): Promise<responseAB[]> {
    const response = await axios.post(configData.graph.MAIN, {
      query: `{ 
        optionContracts(first:10000,where:{routerContract_in:["0x256b403E6973737DfdafbFAcEB2A2f4065265981","0xE450A00351A59AFc3cde65bA846AE561C584eDaC"]}) {
            address
            token1
            token0
            isPaused
            routerContract
            poolContract
            openUp
            openDown
            openInterestUp
            openInterestDown
           config: configContract {
              address
              maxSkew
              circuitBreakerContract
              traderNFTContract
              sf
              sfdContract
              payout
              platformFee
              optionStorageContract
              stepSize
            }
          }
        }`,
    });

    return response.data?.data?.optionContracts as responseAB[];
  }

  const { data, error, mutate } = useSWR<responseAB[], Error>(
    `above-below-activeChain-${activeChain.id}`,
    {
      fetcher: fetcher,
      refreshInterval: 60000,
    }
  );
  useEffect(() => {
    if (data)
      setMarkets(
        data
          .map((option) => {
            const poolInfo =
              configData.poolsInfo[
                getAddress(
                  option.poolContract
                ) as keyof typeof configData.poolsInfo
              ];
            if (!poolInfo) return null;
            const chartData =
              marketsForChart[
                (option.token0 + option.token1) as keyof typeof marketsForChart
              ];
            if (!chartData) return null;
            return {
              ...option,
              poolInfo: poolInfo,
              ...chartData,
            };
          })
          .filter((option) => option !== null) as marketTypeAB[]
      );
  }, [data, activeChain]);
};
