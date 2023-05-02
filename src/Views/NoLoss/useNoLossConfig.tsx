import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';
import { noLossConfig } from './NoLossConfig';
import configABI from './ABI/ConfigABI.json';
import { convertBNtoString, useSignerOrPorvider } from '@Utils/useReadCall';
import { multicallv2 } from '@Utils/Contract/multiContract';
import getDeepCopy from '@Utils/getDeepCopy';
const Calls = ['minPeriod', 'maxPeriod', 'minFee', 'maxFee'];

export const useNoLossStaticConfig = () => {
  const { activeChain } = useActiveChain();
  const data = useMemo(() => {
    console.log(`activeChain.id: `, activeChain.id);
    const graphUrl = noLossConfig[activeChain.id]?.graph.MAIN;
    console.log(`noLossConfig[activeChain.id]: `, noLossConfig[activeChain.id]);
    const chainId = activeChain.id;
    const multicall = noLossConfig[activeChain.id]?.multicall;
    const allConfig = noLossConfig['421613'];
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
const useNoLossConfig = () => {
  const config = useNoLossStaticConfig();
  const sOrP = useSignerOrPorvider();
  return useSWR(`config-root-config-${config.chainId}`, {
    fetcher: async (name) => {
      const basicQuery = `
      optionContracts: optionContracts(
        first: 1000
        ) {
          id
          address
          config
          asset
          isPaused
        }
        `;
      const response = await axios.post(config.graph.MAIN, {
        query: `{${basicQuery}}`,
      });
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

      let returnData = await multicallv2(calls, sOrP, config.multicall, '');
      let copy = getDeepCopy(returnData);
      convertBNtoString(copy);
      let appConfig = {};
      console.log(
        `response.data.data.optionContracts: `,
        response.data.data.optionContracts
      );
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
    // TODO see if there is retrying machanism on swr than only do this req one time
    refreshInterval: 100000,
  });
};

export { useNoLossConfig };
// {
//   "id": "0x7b2506a9ed9224040dc017bee285c16f984259a3",
//   "address": "0x7b2506a9ed9224040dc017bee285c16f984259a3",
//   "config": "0x08b0912647cfbba0bf1c28c2cb3b42ea0198f579",
//   "asset": "EURUSD",
//   "isPaused": false
// }

interface IPair {
  minPeriod: string;
  maxPeriod: string;
  minFee: string;
  maxFee: string;
  configContract: string;
  market: {
    pricePrecision: number;
    pair: string;
    category: 'Crypto' | 'Forex';
    fullName: string;
  };
  isPaused: false;
  optionsContract: string;
}
