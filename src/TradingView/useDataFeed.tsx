import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import axios from 'axios';
import { IMarket, useQTinfo } from '@Views/BinaryOptions';
import { w3cwebsocket as W3CWebsocket } from 'websocket';

import { divide } from '@Utils/NumString/stringArithmatics';
const FIRST_TIMESTAMP = 1673239587;
export function getBlockFromBar(bar) {
  if (bar.time) return bar;
  return {
    time: bar[0],
    open: bar[1],
    high: bar[2],
    low: bar[3],
    close: bar[4],
    volume: +bar[5],
  };
}
const VISIBLE_TOLERATION_SEC = 10 * 60;
const INVISIBLE_TOLERATION_SEC = 1 * 60;
const getKlineFromPrice = (chunk) => {
  const priceObj = {};
  const res = chunk.toString();
  const assets = res.split('|');
  let partial = false;

  let secondLastCharacter =
    assets[assets.length - 1][assets[assets.length - 1].length - 2];
  if (secondLastCharacter != '|') {
    partial = true;
  }

  assets.forEach((asset, idx) => {
    if (partial && idx === assets.length - 1) return;
    asset.split('\n').forEach((newLinesSplitted, idx) => {
      if (newLinesSplitted) {
        newLinesSplitted.split('|').forEach((orSplitted, idx) => {
          if (orSplitted)
            orSplitted.split('\r').forEach((assetString, idx) => {
              if (assetString) {
                if (assetString.includes('[')) return;
                const [assetName, decimalTs, numPrice] = assetString.split(':');
                if (!assetName || !decimalTs || !numPrice) return;

                const ts = (decimalTs as string).replace('.', '');
                const absolutePrice = numPrice;
                priceObj[assetName] = [
                  {
                    time: +ts,
                    close: absolutePrice,
                    open: absolutePrice,
                    high: absolutePrice,
                    low: absolutePrice,
                  },
                ];
              }
            });
        });
      }
    });
  });

  return priceObj;
};
const parsewsmsg = (res) => {
  const priceObj = {};
  const assets = res.split('|');
  let partial = false;

  let secondLastCharacter =
    assets[assets.length - 1][assets[assets.length - 1].length - 2];
  if (secondLastCharacter != '|') {
    partial = true;
  }

  assets.forEach((asset, idx) => {
    if (partial && idx === assets.length - 1) return;
    asset.split('\n').forEach((newLinesSplitted, idx) => {
      if (newLinesSplitted) {
        newLinesSplitted.split('|').forEach((orSplitted, idx) => {
          if (orSplitted)
            orSplitted.split('\r').forEach((assetString, idx) => {
              if (assetString) {
                if (assetString.includes('[')) return;
                const [assetName, decimalTs, numPrice,volume] = assetString.split(':');
                if (!assetName || !decimalTs || !numPrice) return;
                const [s, ms] = (decimalTs as string).split('.');
                const ts = +s * 1000 + +ms;
                const absolutePrice = numPrice;
                const priceUpdate = { time: +ts, price: absolutePrice,volume:volume?+volume:0 };
                if (!priceObj[assetName]) {
                  priceObj[assetName] = [priceUpdate];
                } else {
                  priceObj[assetName].push(priceUpdate);
                }
              }
            });
        });
      }
    });
  });

  return priceObj;
};

const getAggregatedBarv2 = (prevBar, currentBar, resolution) => {
  const resolutionInSeconds = +resolution * 60 * 1000;
  let updatedBar;
  const isSameCandle =
    Math.floor(currentBar.time / resolutionInSeconds) ==
    Math.floor(prevBar.time / resolutionInSeconds);
  if (isSameCandle)
    updatedBar = {
      time: currentBar.time,
      close: currentBar.price,
      high: Math.max(prevBar.high, currentBar.price),
      low: Math.min(prevBar.low, currentBar.price),
      open: prevBar.close,
      volume: currentBar.volume,
    };
  else {
    updatedBar = {
      time: currentBar.time,
      close: currentBar.price,
      high: currentBar.price,
      low: currentBar.price,
      open: currentBar.price,
      volume: currentBar.volume,
    };
  }
  return updatedBar;
};
interface SUpdate {
  ts: number;
  price: string;
}
const getOHLCfromPrice = (priceObj, time) => {
  const a = {
    close: priceObj.p,
    open: priceObj.p,
    low: priceObj.p,
    high: priceObj.p,
    time,
    '24h_change': priceObj['24h_change'],
  };
  return a;
};
interface Ikline {
  high: number;
  low: number;
  open: number;
  close: number;
  time: number;
}
export function getDecimalBlockFromBar(bar) {
  const expandedBar = getBlockFromBar(bar);
  const updatedBar = {
    ...expandedBar,
    high: divide(expandedBar.high, 8),
    open: divide(expandedBar.open, 8),
    close: divide(expandedBar.close, 8),
    low: divide(expandedBar.low, 8),
  };
  return updatedBar;
}
const client = new W3CWebsocket('wss://oracle-v2.buffer.finance')
const PRICE_PROVIDER = 'Buffer Finance';
export let supported_resolutions = [
  '1S',
  '10S',
  '1',
  '5',
  '15',
  '30',
  '1H',
  // "2H",
  '4H',
  // "1D",
];

const timeDeltaMapping = (t) => {
  if (typeof t == 'string') {
    if (
      t.toLowerCase().includes('d') ||
      t.toLowerCase().includes('q') ||
      t.toLowerCase().includes('s')
    ) {
      return t.toLowerCase();
    }
  }

  if (t < 60) {
    // under minutes
    return t + 'm';
  }
  let ans;
  if (t < 1440) {
    // under hours
    ans = Math.round(t / 60) + 'h';
  } else {
    // under days
    ans = Math.round(t / 60 / 24) + 'd';
  }

  return ans;
};
const confgis = {
  supported_resolutions,
  exchanges: [
    {
      // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
      value: PRICE_PROVIDER,

      // filter name
      name: PRICE_PROVIDER,

      // full exchange name displayed in the filter popup
      desc: PRICE_PROVIDER,
    },
  ],
  symbols_types: [
    {
      name: 'Crypto',

      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'Crypto',
    },
    {
      name: 'Currencies',

      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'Currencies',
    },
    // ...
  ],
};

const priceObj = {};

enum TVSyncingStates {
  SyncNeeded = 1,
  Syncing = 2,
  Synced = 3,
}
interface ITVSyncing {
  state: TVSyncingStates;
  s?: number;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const appendUpdates = (priceObj, chunk) => {
  if (!chunk) return priceObj;
  for (let market in chunk) {
    if (chunk[market].length > 0) {
      // there is a new update
      if (priceObj[market])
        // there is already an update
        priceObj[market] = [...priceObj[market], ...chunk[market]];
      // there is no update
      else priceObj[market] = chunk[market];
    }
  }
  return priceObj;
};
let first = null;
const getMergedBars = (storedBars, newBars, time) => {
  // storedBars ...time... newBars ......
  let mergedBars = [];
  let singleBars = [];
  let firstNewBar = newBars[0];
  if (!storedBars) return newBars;
  if (firstNewBar && storedBars?.length)
    for (let sotreBar of storedBars) {
      if (sotreBar.time < firstNewBar.time) {
        singleBars.push(sotreBar);
      }
    }
  singleBars = [...singleBars, ...newBars];
  for (let singleBar of singleBars) {
    if (time < singleBar.time) {
      mergedBars.push(singleBar);
    }
  }

  return mergedBars;
};
export default function useDataFeed(chartReady) {
 

  const qtInfo = useQTinfo();
  const storedUpdates = useRef({});

  const [marketPrices, setMarketPrices] = useAtom(marketPriceAtom);
  const setLastDayChange = useSetAtom(market2dayChangeAtom);
  const [reader, setReader] = useState(null);
  const activeAsset = qtInfo.activePair;
  // const streamInit = async () => {
  //   setReader(null);

  //   const res = await fetch('https://oracle-stream.buffer.finance/stream');
  //   setReader(res.body.getReader());
  // };
  const [state, setState] = useAtom(TVStateAtom);

  // useEffect(() => {
  //   if (state.type == 'active') streamInit();
  // }, [state, chartReady]);
  const [sync, setSync] = useState<ITVSyncing>({
    state: TVSyncingStates.SyncNeeded,
  });
  const fn = async (res) => {
    if (!chartReady) return;
    console.time('fn-start')
    const priceUpdates = parsewsmsg(res);

    // const resp = await reader?.closed?.();
    const activeResolution = realTimeUpdate.current?.resolution || '1m';
    let prevBar =
      lastSyncedKline?.current?.[
        activeAsset.tv_id + timeDeltaMapping(activeResolution)
      ];
    const activeAssetStream = priceUpdates[activeAsset.tv_id];
    const latestKline = getKlineFromPrice(res);
    
    if (activeAssetStream?.length && prevBar) {
      let aggregatedBar;
      const storedBars = storedUpdates.current[activeAsset.tv_id];
      const completeBars = getMergedBars(
        storedBars,
        activeAssetStream,
        prevBar.time
        );
        
      for (let currBar of completeBars) {
        aggregatedBar = getAggregatedBarv2(
          prevBar,
          currBar,
          realTimeUpdate.current?.resolution
        );
        storedUpdates.current = {};

        if (
          aggregatedBar &&
          realTimeUpdate.current.symbolInfo.name === activeAsset.tv_id &&
          prevBar.time < aggregatedBar.time
        ) {
          realTimeUpdate.current.onRealtimeCallback(aggregatedBar);
          console.time('befor-update');
          await sleep(document.hidden ? 1 : 39);
          console.timeEnd('befor-update');
          prevBar = aggregatedBar;
        }
      }
      if (aggregatedBar) {
        lastSyncedKline.current[
          activeAsset.tv_id + timeDeltaMapping(activeResolution)
        ] = aggregatedBar;
      }
    }
    if (!prevBar) {
      const bar = appendUpdates(storedUpdates.current, priceUpdates);
      storedUpdates.current = bar;
      console.log('not-prev bar', storedUpdates.current, priceUpdates);
    }
    console.timeEnd('fn-start')
    
    setMarketPrices((mp) => {
      return { ...mp, ...latestKline };
    });
    // } catch (err) {
    //   setBreakingCount({state:'break'});
    //   streamInit();
    // }
  };
  useEffect(() => {
    if (!chartReady) return;
    console.log(`client: `, client);
    client.onmessage = (e) => {
      fn(e.data);
    };
  }, [client, chartReady]);

  // useEffect(() => {
  //   if (!reader) return;
  //   if (state.type == "stale") {
  //     killStream();
  //   } else {
  //     fn();
  //   }
  // }, [reader, activeAsset, marketPrices, state]);
  const realTimeUpdate = useRef<null | {
    symbolInfo?: {
      name: string;
      full_name: string;
      symbol: string;
      description: string;
      exchange: string;
      type: string;
      pricescale: number;
      pair: string;
    };
    resolution: string;
    onRealtimeCallback: (a?: any) => {};
    onResetCacheNeededCallback: () => {};
  }>();

  const lastSyncedKline = useRef<{ [asset: string]: Ikline }>({});

  async function getAllSymbols() {
    let allSymbols = [];
    let tempSymbols = [];
    for (const singleAsset of qtInfo.pairs) {
      tempSymbols = [
        {
          symbol: singleAsset.tv_id,
          full_name: singleAsset.tv_id,
          description: singleAsset.tv_id,
          exchange: PRICE_PROVIDER,
          type: singleAsset.category,
          pricescale: singleAsset.price_precision,
          pair: singleAsset.pair,
        },
        ...tempSymbols,
      ];
      allSymbols = [...tempSymbols];
    }
    return allSymbols;
  }
  return [
    {
      onReady: (callback) => {
        setTimeout(() => callback(confgis));
      },
      searchSymbols: async (
        userInput,
        exchange,
        symbolType,
        onResultReadyCallback
      ) => {
        const symbols = await getAllSymbols();

        const newSymbols = symbols.filter((symbol) => {
          return (
            typeof symbol.symbol === 'string' &&
            symbol.symbol.includes(userInput) &&
            symbol.type.toLowerCase() == symbolType.toLowerCase()
          );
        });
        onResultReadyCallback(newSymbols);
      },

      resolveSymbol: async (
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback
      ) => {
        let _symbolName = activeAsset.tv_id;
        const symbols = await getAllSymbols();
        const symbolItem = symbols?.find(
          ({ symbol, full_name }) =>
            symbol === symbolName || full_name === symbolName
        );

        if (!symbolItem) {
          onResolveErrorCallback('cannot resolve symbol');
          return;
        }

        const symbolInfo = {
          ticker: symbolItem.full_name,
          name: symbolItem.symbol,
          description: symbolItem.description,
          type: symbolItem.type,
          session: '24x7',
          // timezone: "Asia/Kolkata",
          exchange: symbolItem.exchange,
          minmov: 1,
          pricescale: symbolItem.pricescale,
          has_intraday: true,
          has_seconds: true,
          seconds_multipliers: [1, 10],
          has_weekly_and_monthly: true,
          supported_resolutions,
          volume_precision: 2,
          data_status: 'streaming',
          pair: symbolItem.pair,
        };

        onSymbolResolvedCallback(symbolInfo);
      },
      getBars: async (
        symbolInfo,
        resolution,
        periodParams,
        onHistoryCallback,
        onErrorCallback
      ) => {
        try {
          const { from, to, firstDataRequest } = periodParams;
          if (firstDataRequest) {
            lastSyncedKline.current = {};
          }

          let bars = [];
          const getBarsFnActiveAsset = symbolInfo.name;

          const req = firstDataRequest
            ? {
                pair: getBarsFnActiveAsset,
                interval: timeDeltaMapping(resolution),
                limit: 1000,
              }
            : {
                pair: getBarsFnActiveAsset,
                interval: timeDeltaMapping(resolution),
                limit: 1000,
                start_time: from * 1000,
                end_time: to * 1000,
              };
          const bundle = [
            axios.post(`https://oracle.buffer.finance/multi/uiKlines/`, [req]),
            axios.get('https://oracle.buffer.finance/price/latest/'),
          ];
          const [d, allPrices] = await Promise.all(bundle);
          const allPricesData = allPrices.data.data;
          let mappedData = {};
          let lastDayChange = {};
          if (allPricesData) {
            for (let a in allPricesData) {
              mappedData[a] = [
                getOHLCfromPrice(allPricesData[a], allPricesData.timestamp),
              ];
              lastDayChange[a] = allPricesData[a]['24h_change'];
            }
          }

          const tempData = d.data[0].result as Ikline[];
          // tempData.reverse();
          const query = d.data[0].query;
          // bars = tttd;
          if (!tempData) return;
          tempData.forEach((bar, idx) => {
            bars = [...bars, getBlockFromBar(bar)];
          });
          const recentBar = bars[bars.length - 1];
          // bars = generateRandomCandles(from, to);
          if (firstDataRequest && bars.length) {
            setLastDayChange(lastDayChange);
            lastSyncedKline.current[
              getBarsFnActiveAsset + timeDeltaMapping(resolution)
            ] = recentBar;
            setMarketPrices((d) => {
              return {
                ...mappedData,
                ...d,
                [getBarsFnActiveAsset]: [recentBar],
              };
            });
            setSync({
              state: TVSyncingStates.SyncNeeded,
              s: recentBar.time,
            });
          }

          const isLastChunk =
            query.start_time / 1000 <= FIRST_TIMESTAMP ? true : false;

          onHistoryCallback(bars, {
            noData: isLastChunk,
          });
        } catch (error) {
          onErrorCallback(error);
        }
      },
      subscribeBars: (
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscribeUID,
        onResetCacheNeededCallback
      ) => {
        realTimeUpdate.current = {
          symbolInfo,
          resolution,
          onRealtimeCallback,
          onResetCacheNeededCallback,
        };
        onResetCacheNeededCallback();
        // updateBar();
      },
      unsubscribeBars: (subscriberUID) => {},
    },
    realTimeUpdate,
  ];
}

export const lastTimestampAtom = atom<any>({});
export const marketPriceAtom = atom<{
  [market: string]:
    | {
        close: number;
        hight: number;
        low: number;
        open: number;
        time: number;
        '24h_change': number;
      }
    | SUpdate[];
}>({});
export const market2dayChangeAtom = atom<{
  [market: string]: {
    '24h_change': number;
  };
}>({});

export const TVStateAtom = atom<{ type: 'active' | 'stale'; ts?: number }>({
  type: 'active',
});

export const getPriceFromKlines = (marketPrice, asset: { tv_id: string }) => {
  const lastBar = getLastbar(marketPrice, asset);
  if (!lastBar) return null;
  return lastBar.close;
};
export const get24hChange = (marketPrice, asset: { tv_id: string }) => {
  return marketPrice[asset.tv_id] ?? 'N/A';
};

export const getLastbar = (marketPrice, asset): Ikline | null => {
  if (!asset?.tv_id) return null;
  const kline = marketPrice?.[asset.tv_id];

  if (!kline) return null;

  return kline[kline.length - 1];
};

export const streamBreakedAtom = atom({ state: 'break' });
