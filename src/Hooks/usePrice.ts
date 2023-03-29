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

export const usePrice = (fetchInitialPrices?: boolean) => {
  const setPrice = useSetAtom(priceAtom);
  const closeRef = useRef<boolean>(false);
  const setWsState = useSetAtom(wsStateAtom);
  const { readyState } = useWebSocket(
    'wss://oracle-v2.buffer-finance-api.link',
    {
      onMessage: (price) => {
        const priceUpdates = parsewsmsg(price.data);
        console.log(`priceUpdates: `, priceUpdates);
        setPrice((p) => ({ ...p, ...priceUpdates }));
      },
      onOpen: async () => {
        if (!fetchInitialPrices) return;
        const allPrices = await axios.get(
          'https://oracle.buffer-finance-api.link/price/latest/'
        );
        const allPricesData = allPrices.data.data as LatestPriceApiRes;
        let mappedData: Partial<Market2Prices> = {};

        if (allPricesData) {
          console.log(`allPricesData: `, allPricesData);
          for (let a in allPricesData) {
            const OHLC = getOHLCfromPrice(
              allPricesData[a as Markets],
              allPricesData.timestamp as number
            );
            mappedData[a as Markets] = [
              {
                price: OHLC.close?.toString(),
                time: Date.now(),
                volume: 0,
              },
            ];
          }
        }
        console.log(`mappedData: `, mappedData);
        // setPrice((p) => ({ ...p, ...priceUpdates }));
      },
      onError: () => {
        console.log('[ws]-err');
      },
      onClose: () => {
        console.log('[ws]-close');
      },
      retryOnError: true,
      reconnectInterval: 199,
      shouldReconnect(event) {
        return true;
      },
    }
  );
  useEffect(() => {
    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    setWsState({ state: connectionStatus });
    console.log(`[ws]-readyState: `, readyState);
  }, [readyState]);
  useEffect(() => {
    closeRef.current = false;
    return () => {
      closeRef.current = true;
    };
  }, []);
};

export const wsStateAtom = atom<{ state: string }>({
  state: 'need-connection',
});
export const priceAtom = atom<Partial<Market2Prices>>({});
