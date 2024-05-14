import { multiply } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import Big from 'big.js';
import { atom, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Market2Prices } from 'src/Types/Market';
import { reconnectingSocket } from './wsclient';
import {
  getActiveMarket,
  useActiveMarket,
} from '@Views/TradePage/Hooks/useActiveMarket';
import { useParams } from 'react-router-dom';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
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
export let ts2asset2updatecnt = {};

export const silentPriceCache = {};
export const usePrice = () => {};
export const usePriceRetriable = () => {
  const setPrice = useSetAtom(priceAtom);
  const [isConnected, setIsConnected] = useState(client.isConnected());
  const params = useParams();
  const appConfig = useMarketsConfig();
  const activeMarket = useMemo(
    () => getActiveMarket(appConfig, params),
    [appConfig, params]
  );
  console.log(`activeMarket: `, activeMarket);
  console.log(`activeMarket: `, activeMarket);
  const activeMarketRef = useRef('BTCUSD');
  useEffect(() => {
    activeMarketRef.current = activeMarket?.token0
      ? activeMarket?.token0 + activeMarket?.token1
      : 'BTCUSD';
  }, [activeMarket]);

  useEffect(() => {
    return client.onStateChange(setIsConnected);
  }, [setIsConnected]);
  useEffect(() => {
    function handleMessage(message: string) {
      const lastJsonMessage = JSON.parse(message);
      if (!lastJsonMessage) return;
      if ((lastJsonMessage as WSUPdate).type == 'price_update') {
        const priceUpdatePacked = [
          {
            price: multiply(
              (lastJsonMessage as WSUPdate).price_feed.price.price,
              new Big('10')
                .pow((lastJsonMessage as WSUPdate).price_feed.price.expo)
                .toString()
            ),
            time:
              (lastJsonMessage as WSUPdate).price_feed.price.publish_time *
              1000,
          },
        ];
        const data = {
          [pythIds[(lastJsonMessage as WSUPdate).price_feed.id]]:
            priceUpdatePacked,
        };
        silentPriceCache[pythIds[(lastJsonMessage as WSUPdate).price_feed.id]] =
          priceUpdatePacked;
        // console.log(`setting: `, message);
        // const ts = Math.floor(Date.now() / 1000);
        const asset = Object.keys(data)[0];
        // if (ts in ts2asset2updatecnt) {
        //   let asset2updatecnt = ts2asset2updatecnt[ts];
        //   if (asset in asset2updatecnt) {
        //     asset2updatecnt[asset]++;
        //   } else {
        //     // replace asset2updatecnt with ts2asset2updatecnt in below line
        //     ts2asset2updatecnt[ts] = { ...ts2asset2updatecnt[ts], [asset]: 1 };
        //   }
        // } else {
        //   const assetUpdated = { [asset]: 1 };
        //   ts2asset2updatecnt = { ...ts2asset2updatecnt, [ts]: assetUpdated };
        // }
        if (activeMarketRef.current && asset == activeMarketRef.current) {
          setPrice((p) => ({ ...p, ...data }));
        }
      }
    }
    client.on(handleMessage);
    return () => client.off(handleMessage);
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
  '3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca': 'USDCAD',
  '0b1e3297e69f162877b577b0d6a47a0d63b2392bc8499e6540da4187a63e28f8': 'USDCHF',
  '67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80': 'AUDUSD',
  '396a969a9c1480fa15ed50bc59149e2c0075a72fe8f458ed941ddec48bdb4918': 'USDSGD',
  '92eea8ba1b00078cdc2ef6f64f091f262e8c7d0576ee4677572f314ebfafa4c7': 'NZDUSD',
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
