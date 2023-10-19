import { multiply } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import Big from 'big.js';
import { atom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Market2Prices } from 'src/Types/Market';
import { reconnectingSocket } from './wsclient';
type WSUPdate = {
  type: 'price_update';
  price_feed: {
    ema_price: {
      conf: string;
      expo: number;
      price: string;
      publish_time: number;
    };
    id: string;
    price: {
      conf: string;
      expo: number;
      price: string;
      publish_time: number;
    };
  };
};
const client = reconnectingSocket('wss://hermes.pyth.network/ws');

export const silentPriceCache = {};
export const usePrice = () => {};
export const usePriceRetriable = () => {
  const setPrice = useSetAtom(priceAtom);
  const [isConnected, setIsConnected] = useState(client.isConnected());

  useEffect(() => {
    return client.onStateChange(setIsConnected);
  }, [setIsConnected]);
  useEffect(() => {
    const interval = setInterval(() => {
      // let data = {
      //   XRPUSD: [
      //     {
      //       price: '0.48870772',
      //       time: 1697646151000,
      //     },
      //   ],
      //   TONUSD: [
      //     {
      //       price: '2.03845289',
      //       time: 1697646151000,
      //     },
      //   ],
      //   BTCUSD: [
      //     {
      //       price: '28348.91497661',
      //       time: 1697646151000,
      //     },
      //   ],
      //   XAUUSD: [
      //     {
      //       price: '1947.517',
      //       time: 1697646151000,
      //     },
      //   ],
      //   GBPUSD: [
      //     {
      //       price: '1.21403',
      //       time: 1697646151000,
      //     },
      //   ],
      //   DOGEUSD: [
      //     {
      //       price: '0.058643',
      //       time: 1697646151000,
      //     },
      //   ],
      //   SHIBUSD: [
      //     {
      //       price: '0.0000068397',
      //       time: 1697646151000,
      //     },
      //   ],
      //   MATICUSD: [
      //     {
      //       price: '0.51597266',
      //       time: 1697646151000,
      //     },
      //   ],
      //   XAGUSD: [
      //     {
      //       price: '22.83475',
      //       time: 1697646149000,
      //     },
      //   ],
      //   EURUSD: [
      //     {
      //       price: '1.05258',
      //       time: 1697646151000,
      //     },
      //   ],
      //   SOLUSD: [
      //     {
      //       price: '23.74890171',
      //       time: 1697646151000,
      //     },
      //   ],
      //   OPUSD: [
      //     {
      //       price: '1.19700949',
      //       time: 1697646151000,
      //     },
      //   ],
      //   ETHUSD: [
      //     {
      //       price: '1573.87929167',
      //       time: 1697646151000,
      //     },
      //   ],
      //   ARBUSD: [
      //     {
      //       price: '0.7854553',
      //       time: 1697646151000,
      //     },
      //   ],
      //   BNBUSD: [
      //     {
      //       price: '211.808805',
      //       time: 1697646151000,
      //     },
      //   ],
      //   LINKUSD: [
      //     {
      //       price: '7.42650175',
      //       time: 1697646151000,
      //     },
      //   ],
      // };
      const rando = 2000 + Math.random() * 1000;
      const data = {
        BTCUSD: [
          {
            time: Date.now(),
            price: '' + rando,
          },
        ],
      };
      setPrice((p) => {
        const dat = { ...p, ...data };
        return dat;
      });
    }, 125);
    // client.on(handleMessage);
    return () => clearInterval(interval);
  }, [setPrice]);
  useEffect(() => {
    if (isConnected) {
      client.getClient()!.send(
        JSON.stringify({
          ids: Object.keys(pythIds),
          type: 'subscribe',
        })
      );
    }
  }, [isConnected]);
};

export const wsStateAtom = atom<{ state: string }>({
  state: 'need-connection',
});
export const priceAtom = atom<Partial<Market2Prices>>({});
export const pythIds = {
  ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace: 'ETHUSD',
  e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43: 'BTCUSD',
  '84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1': 'GBPUSD',
  a995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b: 'EURUSD',
  '3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5': 'ARBUSD',
  '2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f': 'BNBUSD',
  '5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52':
    'MATICUSD',
  '385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf': 'OPUSD',
  '765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2': 'XAUUSD',
  f2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e: 'XAGUSD',
  ec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8: 'XRPUSD',
  dcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c: 'DOGEUSD',
  '8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026': 'TONUSD',
  f0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a: 'SHIBUSD',
  '8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221': 'LINKUSD',
  ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d: 'SOLUSD',
};
export const getPrice = async () => {
  const price = await axios.get(
    `https://xc-mainnet.pyth.network/api/latest_price_feeds?` +
      Object.keys(pythIds)
        .map((d) => 'ids[]=0x' + d)
        .join('&')
  );
  const marketPrice = {};
  price.data.forEach((e) => {
    marketPrice[pythIds[e.id]] = [
      {
        price: multiply(
          e.price.price,
          new Big('10').pow(e.price.expo).toString()
        ),
        time: e.price.publish_time * 1000,
      },
    ];
  });
  return marketPrice;
};
