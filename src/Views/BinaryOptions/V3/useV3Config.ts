import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { v3Config } from './v3Config';
import configABI from '../ABI/configABI.json';
import { convertBNtoString, useSignerOrPorvider } from '@Utils/useReadCall';
import { multicallv2 } from '@Utils/Contract/multiContract';
import getDeepCopy from '@Utils/getDeepCopy';
import { MarketInterface } from 'src/MultiChart';
const Calls = ['minPeriod', 'maxPeriod', 'minFee', 'maxFee'];

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

const marketid2Info = {
  BTCUSD: {
    price_precision: 100,
    pair: 'BTC-USD',
    category: 'Crypto',
    fullName: 'Bitcoin',
    tv_id: 'BTCUSD',
  },
  ETHUSD: {
    price_precision: 100,
    pair: 'ETH-USD',
    category: 'Crypto',
    fullName: 'Ethereum',
    tv_id: 'ETHUSD',
  },
  GBPUSD: {
    price_precision: 100,
    pair: 'GBP-USD',
    category: 'Forex',
    fullName: 'Pound',
    tv_id: 'GBPUSD',
  },
  EURUSD: {
    price_precision: 100,
    pair: 'EUR-USD',
    category: 'Forex',
    fullName: 'Euro',
    tv_id: 'EURUSD',
  },
};

const useV3Config = () => {
  const config = useNoLossStaticConfig();
  const sOrP = useSignerOrPorvider();
  console.log('goes inhere');
  return useSWR<{ [a: string]: MarketInterface }>(
    `config-root-config-${config.chainId}`,
    {
      fetcher: async (name) => {
        const basicQuery = `
      optionContracts: optionContracts(
        first: 1000
        ) {
          id
          address
          asset
          isPaused
        }
        `;
        const response = await axios.post(config.graph.MAIN, {
          query: `{${basicQuery}}`,
        });
        console.log(`useV3Config-response: `, response);
        let calls = [];

        response.data.data.optionContracts.forEach((s) => {
          Calls.forEach((c) => {
            calls.push({
              address: s.config,
              abi: configABI,
              name: c,
              params: [],
            });
          });
        });

        console.log(`useV3Config-calls: `, calls);
        let returnData = await multicallv2(calls, sOrP, config.multicall, '');
        let copy = getDeepCopy(returnData);
        convertBNtoString(copy);
        let appConfig = {};

        response.data.data.optionContracts.forEach((s, sid) => {
          const key = s.asset;
          Calls.forEach((c, cid) => {
            if (appConfig?.[key]) {
              appConfig[key] = {
                ...appConfig[key],
                [c]: copy[sid + cid][0] + '',
              };
            } else {
              appConfig[key] = {
                [c]: copy[sid + cid][0] + '',
              };
            }
          });
          appConfig[key] = {
            ...appConfig[key],
            configContract: s.config,
            isPaused: s.isPaused,
            optionsContract: s.address,
            ...marketid2Info[s.asset],
          };
        });

        console.log(`appConfig: `, appConfig);
        return appConfig;
      },
      refreshInterval: 100000,
    }
  );
};

export { useV3Config };
