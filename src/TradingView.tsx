import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LatestPriceApiRes,
  Market2Kline,
  Market2Prices,
  Market2Prices3priceApi,
  Markets,
  OHLCBlock,
  RealtimeUpdate,
} from './Types/Market';
import {
  widget,
  IChartingLibraryWidget,
  IBasicDataFeed,
  ResolutionString,
  Timezone,
  ThemeName,
  LibrarySymbolInfo,
  IChartWidgetApi,
  IPositionLineAdapter,
  SeriesFormat,
} from '../public/static/charting_library';
const FIRST_TIMESTAMP = 1673239587;

import {
  getDisplayDate,
  getDisplayTime,
  getOslonTimezone,
} from '@Utils/Dates/displayDateTime';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithLocalStorage } from '@Views/BinaryOptions/Components/SlippageModal';
import { useQTinfo } from '@Views/BinaryOptions';
import {
  getAggregatedBarv2,
  getBlockFromBar,
  getOHLCfromPrice,
  getVizIdentifier,
  timeDeltaMapping,
} from '@TV/utils';
import axios from 'axios';
import { priceAtom } from '@Hooks/usePrice';
import { sleep } from '@Utils/JSUtils/sleep';
import {
  IGQLHistory,
  tardesAtom,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { visualizeddAtom } from '@Views/BinaryOptions/Tables/Desktop';
import { PRICE_DECIMALS } from '@Views/BinaryOptions/Tables/TableComponents';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { useUserAccount } from '@Hooks/useUserAccount';
import {
  ChartElementSVG,
  ChartTypePersistedAtom,
  ChartTypeSelectionDD,
} from '@TV/ChartTypeSelectionDD';
const PRICE_PROVIDER = 'Buffer Finance';
export let supported_resolutions = [
  // '1S' as ResolutionString,
  // '10S' as ResolutionString,
  '1' as ResolutionString,
  '5' as ResolutionString,
  '15' as ResolutionString,
  '30' as ResolutionString,
  '1H' as ResolutionString,
  // "2H" as ResolutionString,
  '4H' as ResolutionString,
  // "1D",
];

const isntAvailable = (s) => {
  return (
    s && ['1s', '10s', '5m', '60', '120', '240', '1d'].includes(s.toLowerCase())
  );
};
const formatResolution = (s) => {
  if (s.toLowerCase() == '1s') {
    return '1s';
  }
  if (s.toLowerCase() == '10s') {
    return '10s';
  }
  // if(s.toLowerCase() == "10s"){
  //   return "10s"
  // }
  if (s.toLowerCase() == '1') {
    return '1m';
  }
  if (s.toLowerCase() == '5') {
    return '5m';
  }

  if (s.toLowerCase() == '15') {
    return '15m';
  }
  if (s.toLowerCase() == '30') {
    return '30m';
  }
  if (s.toLowerCase() == '60') {
    return '1h';
  }
  if (s.toLowerCase() == '120') {
    return '2h';
  }
  if (s.toLowerCase() == '240') {
    return '4h';
  }
  if (s.toLowerCase() == '1d') {
    return '1d';
  }
  return s;
};

const defaults = {
  priceProvider: 'Buffer Finance',
  cssPath: '/tv.css',
  library_path: '/static/charting_library/',
  theme: 'Dark',
  interval: '1' as ResolutionString,
  basicDisabled: ['header_compare', 'header_symbol_search', 'header_widget'],
  confgis: {
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
  },
  BG: 'rgb(48, 48, 68)',
  upIcon: '▲',
  downIcon: '▼',
  green: 'rgb(108, 211, 173)',
  red: 'rgb(255, 104, 104)',
};
function getText(expiration: number) {
  const curr = Math.round(Date.now() / 1000);
  return `${
    expiration <= curr
      ? 'Processing...'
      : `${formatDistanceExpanded(
          Variables(expiration - Math.round(Date.now() / 1000))
        )}`
  }`;
}
const pythOHLC2rawOHLC = (pythOHLC: {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
}) => {
  console.log(`pythOHLC: `, pythOHLC);
  const rawOhlc = [];
  pythOHLC.c.forEach((element, idx) => {
    rawOhlc.push({
      time: pythOHLC.t[idx] * 1000,
      open: pythOHLC.o[idx],
      close: pythOHLC.c[idx],
      high: pythOHLC.h[idx],
      low: pythOHLC.l[idx],
      volume: pythOHLC.v[idx],
    });
  });
  return rawOhlc;
};
const drawingAtom = atomWithLocalStorage('TradingChartDrawingStorage', null);
// uncomment this for persisting user Resolution - but this has some bugs.
// const market2resolutionAtom = atomWithLocalStorage('market2resolutionAtom', {});
const market2resolutionAtom = atom({});
function drawPosition(
  option: IGQLHistory,
  visualized: any,
  chart: IChartWidgetApi
) {
  let vizIdentifiers = getVizIdentifier(option);
  const idx = visualized.indexOf(vizIdentifiers);
  const openTimeStamp = option.creationTime;
  const optionPrice = +option.strike / PRICE_DECIMALS;

  let color = !option.isAbove ? defaults.red : defaults.green;
  const text =
    `${toFixed(
      divide(option.totalFee?.toString(), option.depositToken.decimals!)!,
      2
    )} ${option.depositToken?.name} | ` + getText(option.expirationTime);
  const tooltip = `${getDisplayDate(openTimeStamp)}, ${getDisplayTime(
    openTimeStamp
  )} - ${getDisplayDate(option.expirationTime)}, ${getDisplayTime(
    option.expirationTime
  )}`;
  // console.log(`chart: `,chart.createPositionLine);
  return chart
    ?.createPositionLine()
    .setText(text)
    .setTooltip(tooltip)
    .setBodyBackgroundColor(defaults.BG)
    .setBodyBorderColor(defaults.BG)
    .setBodyFont('normal 17pt Relative Pro')
    .setQuantityFont('bold 17pt Relative Pro')
    .setQuantityBackgroundColor(color)
    .setQuantityBorderColor(color)
    .setLineColor(color)
    .setBodyTextColor('rgb(255,255,255)')
    .setQuantity(option.isAbove ? defaults.upIcon : defaults.downIcon)
    .setPrice(optionPrice);
  // positions.current.push({ line, expiration: option.expirationTime });
}

export const TradingChart = ({ market: marke }: { market: Markets }) => {
  let market = marke.replace('-', '');
  const [market2resolution, setMarket2resolution] = useAtom(
    market2resolutionAtom
  );
  const qtInfo = useQTinfo();

  const { address } = useUserAccount();
  const [chartReady, setChartReady] = useState<boolean>(false);
  const lastSyncedKline = useRef<{ [asset: string]: OHLCBlock }>({});
  let trade2visualisation = useRef<
    Partial<{
      [key: number]: {
        option: IGQLHistory;
        visited: boolean;
        lineRef: IPositionLineAdapter;
      };
    }>
  >({});
  let realTimeUpdateRef = useRef<RealtimeUpdate | null>(null);
  let widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useAtom(drawingAtom);
  const chartType = useAtomValue(ChartTypePersistedAtom);
  const setChartType = useSetAtom(ChartTypePersistedAtom);

  async function getAllSymbols() {
    let allSymbols: any[] = [];
    let tempSymbols: any[] = [];
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
  const price = useAtomValue(priceAtom);

  const datafeed = useMemo((): Partial<IBasicDataFeed> => {
    return {
      onReady: (callback) => {
        setTimeout(() => callback(defaults.confgis));
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
        const parsedSymbol = symbolName.replace('-', '');
        const symbols = await getAllSymbols();
        const symbolItem = symbols?.find(
          ({ symbol, full_name }) =>
            symbol === parsedSymbol || full_name === parsedSymbol
        );
        if (!symbolItem) {
          onResolveErrorCallback('cannot resolve symbol');
          return;
        }

        const symbolInfo: LibrarySymbolInfo = {
          ticker: symbolItem.full_name,
          name: symbolItem.symbol,
          description: symbolItem.description,
          type: symbolItem.type,
          session: '24x7',
          full_name: symbolItem.full_name,
          exchange: symbolItem.exchange,
          minmov: 1,
          pricescale: symbolItem.pricescale,
          has_intraday: true,
          has_seconds: true,
          visible_plots_set: 'ohlc',
          has_no_volume: true,
          seconds_multipliers: ['1', '10'],
          has_weekly_and_monthly: true,
          supported_resolutions,
          volume_precision: 2,
          data_status: 'streaming',
          timezone: getOslonTimezone() as Timezone,
          listed_exchange: PRICE_PROVIDER,
          format: 'price' as SeriesFormat,
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

          let bars: OHLCBlock[] = [];
          const getBarsFnActiveAsset = symbolInfo.name;

          const req = {
            from,
            to,
            symbol: getBarsFnActiveAsset,
            resolution,
          };

          const pythOHLC = await axios.get(
            `https://pyth-api.vintage-orange-muffin.com/v2/history`,
            {
              params: req,
            }
          );
          const ohlc = pythOHLC2rawOHLC(pythOHLC.data);
          console.log(`ohlc: `, ohlc);
          // const tempData = rawOHLC;
          // console.log(`tempData: `, tempData);
          // if (!tempData) return;
          // tempData.forEach((bar, idx) => {
          //   bars = [...bars, getBlockFromBar(bar)];
          // });

          // const recentBar = bars[bars.length - 1];

          if (firstDataRequest && ohlc.length) {
            lastSyncedKline.current[
              getBarsFnActiveAsset + timeDeltaMapping(resolution)
            ] = ohlc[ohlc.length - 1];
            console.log(`lastSyncedKline: `, lastSyncedKline);
          }
          onHistoryCallback(ohlc, {
            noData: false,
          });
        } catch (error) {
          onErrorCallback(error as string);
        }
      },
      subscribeBars: (
        symbolInfo,
        resolution,
        onRealtimeCallback,
        _,
        onResetCacheNeededCallback
      ) => {
        realTimeUpdateRef.current = {
          symbolInfo,
          resolution,
          onRealtimeCallback,
          onResetCacheNeededCallback,
        };
      },
      unsubscribeBars: () => console.log,
    };
  }, []);
  const { active: activeTrades } = useAtomValue(tardesAtom);
  const [visualized] = useAtom(visualizeddAtom);
  const resolution: ResolutionString = market2resolution?.[market] || '1';

  useLayoutEffect(() => {
    const chart = new widget({
      datafeed,
      interval: defaults.interval,
      timeframe: '200',
      locale: 'en',

      container: containerDivRef.current!,
      library_path: defaults.library_path,
      custom_css_url: defaults.cssPath,
      create_volume_indicator_by_default: false,
      timezone: getOslonTimezone() as Timezone,
      symbol: market,
      theme: defaults.theme as ThemeName,
      enabled_features: ['header_saveload'],
      load_last_chart: true,
      time_frames: [
        {
          text: '1D',
          resolution: '30' as ResolutionString,
          description: '1 Day look back',
          title: '1D',
        },
        {
          text: '4H',
          resolution: '5' as ResolutionString,
          description: '4 Hour look back',
          title: '4H',
        },
        {
          text: '1H',
          resolution: '1' as ResolutionString,
          description: '1 Hour look back',
          title: '1H',
        },
        {
          text: '30',
          resolution: '1' as ResolutionString,
          description: '30 Minute look back',
          title: '30Min',
        },
        {
          text: '10',
          resolution: '1S' as ResolutionString,
          description: '10 Minute look back',
          title: '10Min',
        },
      ],
      saved_data: drawing?.[market],
      disabled_features:
        window.innerWidth < 600
          ? ['left_toolbar', ...defaults.basicDisabled]
          : [...defaults.basicDisabled],
    });
    chart.onChartReady(() => {
      setChartReady(true);
    });
    widgetRef.current = chart;

    return () => {
      widgetRef.current?.remove();
      widgetRef.current = null;
      setChartReady(false);
    };
  }, []);
  const syncTVwithWS = async () => {
    if (typeof realTimeUpdateRef.current?.onRealtimeCallback != 'function')
      return;
    const activeResolution = realTimeUpdateRef.current?.resolution || '1m';
    // console.log(`[deb]1activeResolution: `, activeResolution);

    const key = market + timeDeltaMapping(activeResolution);
    // console.log(`[deb]2key: `, key);
    let prevBar = lastSyncedKline?.current?.[key];
    // console.log(`[deb]3prevBar: `, prevBar);
    if (!prevBar) return;
    const activeAssetStream = price[market];
    console.log(`[pyth]activeAssetStream: `, activeAssetStream);
    // console.log(`[deb]4price: `, activeAssetStream);
    if (!activeAssetStream?.length) return;
    let aggregatedBar;

    for (let currBar of activeAssetStream) {
      aggregatedBar = getAggregatedBarv2(
        prevBar,
        currBar,
        realTimeUpdateRef.current?.resolution
      );
      if (
        aggregatedBar &&
        realTimeUpdateRef.current.symbolInfo &&
        realTimeUpdateRef.current.symbolInfo.name === market
      ) {
        try {
          realTimeUpdateRef.current.onRealtimeCallback(aggregatedBar);
        } catch (err) {
          console.log('[sync]error white updating', err);
        }
        // await sleep(document.hidden ? 1 : 30);
        prevBar = aggregatedBar;
        console.log(
          `[syncdeb]aggregatedBar: `,
          aggregatedBar.close,
          currBar.price
        );
        lastSyncedKline.current[key] = prevBar;
      }
    }
  };
  console.log(`[ip]price: `, price);

  // sync to ws updates
  useEffect(() => {
    syncTVwithWS();
  }, [price[market]]);

  // draw positions.
  useEffect(() => {
    if (chartReady && activeTrades) {
      activeTrades.forEach((pos) => {
        if (!pos?.optionID) return;
        if (trade2visualisation.current[+pos.optionID]) {
          trade2visualisation.current[+pos.optionID]!.visited = true;
        } else {
          trade2visualisation.current[+pos.optionID] = {
            visited: true,
            lineRef: drawPosition(
              pos,
              visualized,
              widgetRef.current?.activeChart()!
            ),
            option: pos,
          };
        }
      });
    }
    for (const trade in trade2visualisation.current) {
      if (!trade2visualisation.current[+trade]?.visited) {
        trade2visualisation.current[+trade]!.lineRef.remove();
        delete trade2visualisation.current[+trade];
      }
    }
    return () => {
      for (const trade in trade2visualisation.current) {
        trade2visualisation.current[+trade]!.visited = false;
      }
    };
  }, [visualized, activeTrades, chartReady]);
  const updatePositionTimeLeft = useCallback(() => {
    // save drawings
    try {
      widgetRef.current?.save((d) => {
        setDrawing((drawing) => {
          return {
            ...drawing,
            [market]: d,
          };
        });
      });
    } catch (e) {
      console.log('major-bug', e);
    }

    for (const trade in trade2visualisation.current) {
      if (trade2visualisation.current[+trade]?.visited) {
        const inv = trade2visualisation.current[+trade]?.lineRef
          ?.getText()
          ?.split('|')[0];
        const strikePrice =
          trade2visualisation.current[+trade]?.lineRef?.getPrice();
        const text =
          inv +
          '| ' +
          getText(trade2visualisation.current[+trade]?.option.expirationTime);
        trade2visualisation.current[+trade]?.lineRef.setText(text);
      }
    }
  }, [setDrawing]);

  useEffect(() => {
    if (!chartReady) return;
    widgetRef.current!.activeChart?.().setChartType(chartType[marke] ?? 1);
  }, [chartType, chartReady]);

  useEffect(() => {
    if (
      chartReady &&
      widgetRef.current &&
      typeof widgetRef.current?.activeChart === 'function'
    ) {
      widgetRef.current.activeChart?.().setResolution(resolution);
    }
  }, [market2resolution, chartReady]);
  useEffect(() => {
    const interval = setInterval(updatePositionTimeLeft, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [address]);

  const toggleIndicatorDD = (_) => {
    widgetRef.current!.activeChart?.().executeActionById('insertIndicator');
  };
  return (
    <div className="flex flex-col w-full h-full">
      <div className="items-center justify-between flex-row flex  bg-2 w-full tv-h px-4 py-3">
        <div className="flex flex-row justify-start font-[500]">
          <div className="ele cursor-pointer">Time</div>
          {supported_resolutions.map((s) => {
            return (
              <div
                onClick={async () => {
                  setMarket2resolution((m) => ({
                    ...m,
                    [market]: s,
                  }));
                  await sleep(100);
                  realTimeUpdateRef.current?.onResetCacheNeededCallback();

                  widgetRef.current?.activeChart().resetData();
                }}
                className={`${
                  s.toLowerCase() == resolution.toLowerCase() && 'active'
                } ${isntAvailable(s) && 'tb'} ele cursor-pointer`}
              >
                {formatResolution(s)}
              </div>
            );
          })}
        </div>
        <div className="flex">
          <ChartTypeSelectionDD
            setActive={(updatedType: number) => {
              console.log(`updatedType: `, updatedType);
              setChartType((ct) => ({ ...ct, [marke]: updatedType }));
            }}
            active={chartType[marke] ?? 1}
          />
          <button
            onClick={toggleIndicatorDD}
            className="flex flex-row mr-3 ele text-f12  font-[500] "
          >
            <ChartElementSVG className="mr-[3px]" /> Indicators
          </button>
        </div>
      </div>
      <div className="w-full h-full">
        <div
          ref={containerDivRef}
          id="chart-element"
          className="TVChartContainer w-[100%] h-[100%]"
        />
      </div>
    </div>
  );
};

/*
{
  ETH-BTC : 1m
  [nothing] : 1m
}



*/
