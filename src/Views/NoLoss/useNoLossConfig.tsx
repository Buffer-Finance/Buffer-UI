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

const useNoLossStaticConfig = () => {
  const { activeChain } = useActiveChain();
  const data = useMemo(() => {
    console.log(`activeChain.id: `, activeChain.id);
    const graphUrl = noLossConfig[activeChain.id]?.graph.MAIN;
    console.log(`noLossConfig[activeChain.id]: `, noLossConfig[activeChain.id]);
    const chainId = activeChain.id;
    const multicall = noLossConfig[activeChain.id]?.multicall;
    return { graphUrl, chainId, multicall };
  }, [activeChain.id]);
  return data;
};

const marketid2Info = {
  BTCUSD: {
    pricePrecision: 100,
    pair: 'BTC-USD',
    category: 'Crypto',
    fullName: 'Bitcoin',
  },
  ETHUSD: {
    pricePrecision: 100,
    pair: 'ETH-USD',
    category: 'Crypto',
    fullName: 'Ethereum',
  },
  GBPUSD: {
    pricePrecision: 100,
    pair: 'GBP-USD',
    category: 'Crypto',
    fullName: 'Pound',
  },
  EURUSD: {
    pricePrecision: 100,
    pair: 'EUR-USD',
    category: 'Crypto',
    fullName: 'Euro',
  },
};
const useNoLossConfig = () => {
  const config = useNoLossStaticConfig();
  const sOrP = useSignerOrPorvider();
  const { data } = useSWR(`config-${config.chainId}`, {
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
      console.log(`basicQuery: `, basicQuery);
      const response = await axios.post(config.graphUrl, {
        query: `{${basicQuery}}`,
      });
      console.log(`response: `, response);
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
      console.log(`appConfig: `, appConfig);
      try {
        response.data.data.optionContracts.forEach((s, sid) => {
          const key = s.asset;
          Calls.forEach((c, cid) => {
            console.log(`c: `, c);
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
            market: marketid2Info[s.asset],
            isPaused: s.isPaused,
            optionsContract: s.address,
          };
        });
        console.log(`appConfig: `, appConfig);
      } catch (e) {
        console.log('errrrr', e);
      }
      return { hello: 'there' };
    },
    // TODO see if there is retrying machanism on swr than only do this req one time
    refreshInterval: 100000,
  });
  return { hello: 'name' };
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
