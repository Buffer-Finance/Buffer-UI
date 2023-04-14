import {
  UTF8ArrToStr,
  getKlineFromPrice,
  getOHLCfromPrice,
  parsewsmsg,
} from '@TV/utils';
import axios from 'axios';
import { atom, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  LatestPriceApiRes,
  Market2Kline,
  Market2Prices,
  Markets,
} from 'src/Types/Market';

import {
  PythConnection,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client';
import { Connection } from '@solana/web3.js';
import { multiply } from '@Utils/NumString/stringArithmatics';
import Big from 'big.js';

const solanaClusterName = 'pythnet';
const solanaWeb3Connection = 'https://pythnet.rpcpool.com/';

export const usePrice = (fetchInitialPrices?: boolean) => {
  const setPrice = useSetAtom(priceAtom);

  const fn = async () => {
    if (fetchInitialPrices) {
      const prices = await getPrice();
      console.log(`pmmprices: `, prices);
      setPrice((p) => ({ ...p, ...prices }));
    }
    const url = 'https://pyth-api.vintage-orange-muffin.com/v2/streaming';
    const response = await fetch(url);
    const reader = response.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const updateStr = UTF8ArrToStr(value);
      const updatePrices = getKlineFromPrice(updateStr);
      setPrice((p) => ({ ...p, ...updatePrices }));
    }
  };
  useEffect(() => {
    fn();
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
};
export const getPrice = async () => {
  const price = await axios.get(
    `https://xc-mainnet.pyth.network/api/latest_price_feeds?` +
      Object.keys(pythIds)
        .map((d) => 'ids[]=0x' + d)
        .join('&')
  );
  const marketPrice = {};
  console.log(`price.data: `, price.data);
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
