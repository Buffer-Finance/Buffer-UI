import { getOHLCfromPrice, parsewsmsg } from '@TV/utils';
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

const solanaClusterName = 'pythnet';
const solanaWeb3Connection = 'https://pythnet.rpcpool.com/';

export const usePrice = (fetchInitialPrices?: boolean) => {
  const setPrice = useSetAtom(priceAtom);
  // const { readyState } = useWebSocket(
  //   'wss://oracle-v2.buffer-finance-api.link',
  //   {
  //     onMessage: (price) => {
  //       const priceUpdates = parsewsmsg(price.data);
  //       console.log(`priceUpdates: `, priceUpdates);
  //       setPrice((p) => ({ ...p, ...priceUpdates }));
  //     },
  //     onOpen: async () => {
  //       if (!fetchInitialPrices) return;
  //       const allPrices = await axios.get(
  //         'https://oracle.buffer-finance-api.link/price/latest/'
  //       );
  //       const allPricesData = allPrices.data.data as LatestPriceApiRes;
  //       let mappedData: Partial<Market2Prices> = {};

  //       if (allPricesData) {
  //         console.log(`allPricesData: `, allPricesData);
  //         for (let a in allPricesData) {
  //           const OHLC = getOHLCfromPrice(
  //             allPricesData[a as Markets],
  //             allPricesData.timestamp as number
  //           );
  //           mappedData[a as Markets] = [
  //             {
  //               price: OHLC.close?.toString(),
  //               time: Date.now(),
  //               volume: 0,
  //             },
  //           ];
  //         }
  //       }
  //       console.log(`mappedData: `, mappedData);
  //       // setPrice((p) => ({ ...p, ...priceUpdates }));
  //     },
  //     onError: () => {
  //       console.log('[ws]-err');
  //     },
  //     onClose: () => {
  //       console.log('[ws]-close');
  //     },
  //     retryOnError: true,
  //     reconnectInterval: 199,
  //     shouldReconnect(event) {
  //       return true;
  //     },
  //   }
  // );
  const pythConnection = useRef(
    new PythConnection(
      new Connection(solanaWeb3Connection),
      getPythProgramKeyForCluster(solanaClusterName)
    )
  );
  useEffect(() => {
    pythConnection.current.onPriceChange((p, o) => {
      // BTCUSD [{
      //   time: +ts,
      //   price: absolutePrice,
      //   volume: volume ? +volume : 0,
      // }];

      if (p?.description && o?.price && o.timestamp) {
        if (p.description == 'BTC/USD' || p.description == 'ETH/USD') {
          const marketId = p.description.replace('/', '');
          const ts = Number(o.timestamp) * 1000;
          const price = o.price;
          const priceUpdates = {
            [marketId]: [
              {
                time: ts,
                price,
              },
            ],
          };
          console.log(`[pyth]priceUpdates: `, priceUpdates);
          setPrice((p) => ({ ...p, ...priceUpdates }));
        }
      }
    });
    pythConnection.current.start();
  }, []);
};

export const wsStateAtom = atom<{ state: string }>({
  state: 'need-connection',
});
export const priceAtom = atom<Partial<Market2Prices>>({});
