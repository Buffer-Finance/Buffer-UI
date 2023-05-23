import { UTF8ArrToStr, getKlineFromPrice } from '@TV/utils';
import axios from 'axios';
import { atom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Market2Prices } from 'src/Types/Market';

import {
  PythConnection,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client';
import { Connection } from '@solana/web3.js';
import { multiply } from '@Utils/NumString/stringArithmatics';
import Big from 'big.js';
import useSWR from 'swr';

const solanaClusterName = 'pythnet';
const solanaWeb3Connection = 'https://pythnet.rpcpool.com/';

export const usePrice = (fetchInitialPrices?: boolean) => {
  const setPrice = useSetAtom(priceAtom);

  const subscribeToStreamUpdates = async () => {
    const url = 'https://pyth-api.vintage-orange-muffin.com/v2/streaming';
    const response = await fetch(url);
    const reader = response.body?.getReader();
    console.log('[stream]err', response.body?.locked);
    let loop = true;
    while (true) {
      try {
        const { value, done } = await reader.read();
        if (done) break;
        const updateStr = UTF8ArrToStr(value);
        const updatePrices = getKlineFromPrice(updateStr);
        setPrice((p) => ({ ...p, ...updatePrices }));
      } catch (err) {
        console.log('[stream]err', response.body?.locked);
        loop = false;
      }
    }
  };

  const subscribeToWSUpdates = async () => {
    const pythConnection = new PythConnection(
      new Connection(solanaWeb3Connection),
      getPythProgramKeyForCluster(solanaClusterName)
    );
    pythConnection.onPriceChange((p, o) => {
      // BTCUSD [{
      //   time: +ts,
      //   price: absolutePrice,
      //   volume: volume ? +volume : 0,
      // }];

      if (p?.description && o?.price && o.timestamp) {
        if (p.description == 'BTC/USD') {
          console.log('price-update:BTC', o);
        }
        if (p.description == 'ETH/USD') {
          console.log('price-update:ETH', o);
        }
        const marketId = p.description.replace('/', '');
        const ts = Number(o.timestamp) * 1000;
        const price = o.price;
        const priceUpdates = {
          [marketId]: [
            {
              ts,
              price,
            },
          ],
        };
        setPrice((p) => ({ ...p, ...priceUpdates }));
      }
    });
    pythConnection.start();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getPrice();
      setPrice((p) => ({ ...p, ...data }));
    }, 1500);
    return () => {
      clearInterval(interval);
    };
    // subscribeToWSUpdates();
  }, []);
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
};
export const getPrice = async () => {
  const price = await axios.get(
    `https://oracle.buffer-finance-api.link/api/latest_price_feeds?` +
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
