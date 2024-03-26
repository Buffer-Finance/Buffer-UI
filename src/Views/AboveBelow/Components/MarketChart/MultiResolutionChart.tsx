import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { getIdentifier } from '@Hooks/useGenericHook';
import { priceAtom } from '@Hooks/usePrice';
import {
  ChartElementSVG,
  ChartTypePersistedAtom,
  ChartTypeSelectionDD,
} from '@TV/ChartTypeSelectionDD';
import { getAggregatedBarv2, timeDeltaMapping } from '@TV/utils';
import {
  getDisplayDate,
  getDisplayTime,
  getOslonTimezone,
} from '@Utils/Dates/displayDateTime';
import { sleep } from '@Utils/JSUtils/sleep';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { atomWithLocalStorage } from '@Utils/atomWithLocalStorage';
import {
  aboveBelowMarketsAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import {
  Markets,
  OHLCBlock,
  RealtimeUpdate,
} from '@Views/ABTradePage/Views/MarketChart/MakrketTypes';
import { queuets2priceAtom, visualizeddAtom } from '@Views/ABTradePage/atoms';
import { PRICE_DECIMALS, marketsForChart } from '@Views/ABTradePage/config';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IBasicDataFeed,
  IChartingLibraryWidget,
  IOrderLineAdapter,
  LibrarySymbolInfo,
  ResolutionString,
  SeriesFormat,
  ThemeName,
  Timezone,
  widget,
} from '../../../../../public/static/charting_library';
import { IGQLHistory, tardesAtom } from '../..//Hooks/usePastTradeQuery';
import { BetState } from '../../Hooks/useAheadTrades';

const PRICE_PROVIDER = 'Buffer Finance';
export let supported_resolutions = [
  // '1S' as ResolutionString,
  // '10S' as ResolutionString,
  '1' as ResolutionString,
  // '3' as ResolutionString,
  '5' as ResolutionString,
  // '10' as ResolutionString,
  '15' as ResolutionString,
  '30' as ResolutionString,
  '1H' as ResolutionString,
  '2H' as ResolutionString,
  '4H' as ResolutionString,
  // "1D",
];
const resolution2seconds = {
  '1': 60,
  '3': 3 * 60,
  '5': 300,
  '15': 15 * 60,
  '30': 30 * 60,
  '1H': 60 * 60,
  '2H': 2 * 60 * 60,
  '4H': 4 * 60 * 60,
  '1D': 24 * 60 * 60,
};
const pythClient = axios.create({ baseURL: 'https://benchmarks.pyth.network' });
axiosRetry(pythClient, { retries: 3 });

export const isntAvailable = (s: string | null) => {
  return (
    s && ['1s', '10s', '5m', '60', '120', '240', '1d'].includes(s.toLowerCase())
  );
};
export const formatResolution = (s: string) => {
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
  // if (s.toLowerCase() == '3') {
  //   return '3m';
  // }

  if (s.toLowerCase() == '15') {
    return '15m';
  }
  if (s.toLowerCase() == '10') {
    return '10m';
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
  basicDisabled: [
    'header_compare',
    'header_symbol_search',
    'header_widget',
    'go_to_date',
    'display_market_status',
  ],
  upRectangeColor: 'rgba(55, 114, 255, 0.1)',
  downRectangeColor: 'rgba(255, 104, 104, 0.1)',

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
  const rawOhlc: any[] = [];
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
function returnMod(num: number, mod: number) {
  const rr = num % mod;

  return num - rr;
}

const drawingAtom = atomWithLocalStorage('drawing-v1', null);
export const market2resolutionAtom = atomWithStorage(
  'TradingChartDrawingStorage-market2resolutionAtom',
  null
);

export const indicatorCoutAtom = atom(0);

const getColor = (isAbove: boolean) => {
  // let color;
  // if (cp < sp) {
  //   color = isAbove ? red : green;
  // } else {
  //   color = !isAbove ? red : green;
  // }
  return !isAbove ? red : green;
};
const BG = 'rgb(48, 48, 68)';
const Up = '▲';
const Down = '▼';
const green = 'rgb(108, 211, 173)';
const red = 'rgb(255, 104, 104)';
function drawPosition(option, visualized, chart) {
  let vizIdentifiers = getIdentifier(option);
  const idx = visualized.indexOf(vizIdentifiers);
  const openTimeStamp = option.creationTime;
  const optionPrice = +option.strike / PRICE_DECIMALS;
  if (idx === -1 && option.state === BetState.active && optionPrice) {
    let color = getColor(option.isAbove);

    return chart
      ?.createPositionLine()
      .setText(
        `${toFixed(
          divide(option.totalFee, option.market.poolInfo.decimals) as string,
          2
        )} | ` + getText(option.expirationTime)
      )
      .setTooltip(
        `${getDisplayDate(openTimeStamp)}, ${getDisplayTime(
          openTimeStamp
        )} - ${getDisplayDate(option.expirationTime)}, ${getDisplayTime(
          option.expirationTime
        )}`
      )
      .setBodyBackgroundColor(BG)
      .setBodyBorderColor(BG)
      .setBodyFont('normal 17pt Relative Pro')
      .setQuantityFont('bold 17pt Relative Pro')
      .setQuantityBackgroundColor(color)
      .setQuantityBorderColor(color)
      .setLineColor(color)
      .setBodyTextColor('rgb(255,255,255)')
      .setQuantity(option.isAbove ? Up : Down)
      .setPrice(optionPrice);
    // positions.current.push({ line, expiration: option.expirationTime });
  }
}
export const MultiResolutionChart = ({
  market: marke,
  isMobile,
  index,
}: {
  market: Markets;
  index: number;
  isMobile?: boolean;
}) => {
  const market = marke.replace('-', '');
  const chartData =
    marketsForChart[market as unknown as keyof typeof marketsForChart];
  const [selectedStrik, setSelectedStrike] = useAtom(selectedPriceAtom);
  const selectedStrike = selectedStrik?.[market];
  const [market2resolution, setMarket2resolution] = useAtom(
    market2resolutionAtom
  );
  const chartId = market + index;
  const [chartReady, setChartReady] = useState<boolean>(false);
  // console.log(`MultiResolutionChart-chartReady-ab: `, chartReady);
  const lastSyncedKline = useRef<{ [asset: string]: OHLCBlock }>({});
  let trade2visualisation = useRef<
    {
      positionRef: IOrderLineAdapter;
      option: IGQLHistory;
    }[]
  >([]);
  const indicatorCount = useAtomValue(indicatorCoutAtom);
  let realTimeUpdateRef = useRef<RealtimeUpdate | null>(null);
  let widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useAtom(drawingAtom);
  const chartType = useAtomValue(ChartTypePersistedAtom);
  const setChartType = useSetAtom(ChartTypePersistedAtom);
  const v3AppConfig = useAtomValue(aboveBelowMarketsAtom);
  const { active: activeTrades } = useAtomValue(tardesAtom);

  async function getAllSymbols() {
    let allSymbols: any[] = [];
    let tempSymbols: any[] = [];
    if (v3AppConfig !== null) {
      for (const singleAsset of v3AppConfig) {
        tempSymbols = [
          {
            symbol:
              singleAsset.pythGroup +
              '.' +
              singleAsset.token0 +
              '/' +
              singleAsset.token1,
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
    }

    return allSymbols;
  }
  const price = useAtomValue(priceAtom);
  const [visualizedTrades, setVisualizedTrades] = useState<
    {
      positionRef: IOrderLineAdapter;
      option: IGQLHistory;
    }[]
  >([]);
  // console.log(price);

  const datafeed: IBasicDataFeed = useMemo(() => {
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
          const pythOHLC = await pythClient.get(
            `v1/shims/tradingview/history`,
            {
              params: req,
            }
          );
          const ohlc = pythOHLC2rawOHLC(pythOHLC.data);

          // console.log(`ohlc: `, ohlc);
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
            // console.log(`lastSyncedKline: `, lastSyncedKline);
          }
          onHistoryCallback(ohlc, {
            noData: false,
          });
        } catch (error) {
          console.log('pyth-deb:error-thrown', error);
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
  const [hideVisulizations] = useAtom(visualizeddAtom);
  const resolution: ResolutionString =
    market2resolution?.[chartId] || ('1' as ResolutionString);

  useEffect(() => {
    try {
      const chart = new widget({
        datafeed,
        interval: defaults.interval,
        timeframe: '200',
        locale: 'en',
        container: containerDivRef.current!,
        library_path: defaults.library_path,
        custom_css_url: defaults.cssPath,
        timezone: getOslonTimezone() as Timezone,
        symbol: market,
        theme: defaults.theme as ThemeName,
        enabled_features: ['header_saveload', 'hide_left_toolbar_by_default'],
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
        saved_data: drawing?.[chartId],
        disabled_features:
          window.innerWidth < 600
            ? ['left_toolbar', ...defaults.basicDisabled]
            : [...defaults.basicDisabled],
      });

      chart.onChartReady(() => {
        // chart.activeChart().get;
        let packedPrice: { price: null | number } = { price: null };
        // chart.activeChart?.().executeActionById('drawingToolbarAction');
        // chart
        //   .activeChart?.()
        //   .crossHairMoved()
        //   .subscribe(null, (p) => {
        //     packedPrice = p;
        //   });
        // document.getElementById(chart._id).contentWindow.document.body.onclick =
        //   () => {
        //     setActiveTab('Limit');
        //     setStrike(round(packedPrice.price, 2));
        //   };
        setChartReady(true);
      });
      widgetRef.current = chart;
    } catch (e) {
      console.log('[chart-deb]-err', e);
    }

    return () => {
      widgetRef.current?.remove();
      widgetRef.current = null;
      setChartReady(false);
    };
  }, []);
  const priceCache = useAtomValue(queuets2priceAtom);
  const syncTVwithWS = async () => {
    if (typeof realTimeUpdateRef.current?.onRealtimeCallback != 'function')
      return;
    const activeResolution = realTimeUpdateRef.current?.resolution || '1m';

    const key = market + timeDeltaMapping(activeResolution);
    const newpythId =
      chartData.pythGroup + '.' + chartData.token0 + '/' + chartData.token1;
    const newpythIdKey = newpythId + timeDeltaMapping(activeResolution);
    let prevBar = lastSyncedKline?.current?.[newpythIdKey];
    if (!prevBar) return;
    const activeAssetStream = (price as any)[market];
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
        realTimeUpdateRef.current.symbolInfo.name === newpythId
      ) {
        try {
          realTimeUpdateRef.current.onRealtimeCallback(aggregatedBar);
        } catch (err) {}
        // await sleep(document.hidden ? 1 : 30);
        prevBar = aggregatedBar;

        lastSyncedKline.current[newpythIdKey] = prevBar;
      }
    }
  };

  // sync to ws updates
  useEffect(() => {
    syncTVwithWS();
  }, [(price as any)?.[market]]);

  const deleteAllPostions = () => {
    trade2visualisation.current.forEach((t) => {
      t.positionRef?.remove();
    });
  };

  const drawPositions = () => {
    let po: {
      positionRef: IOrderLineAdapter;
      option: IGQLHistory;
    }[] = [];
    if (chartReady && activeTrades) {
      activeTrades.forEach((trade) => {
        if (trade === null) return;
        if (trade.queueID === undefined) return;

        // check if we can render or not
        if (typeof widgetRef.current?.activeChart == 'undefined') return;

        // if hidden
        if (hideVisulizations.includes(+trade.queueID)) return;

        const currPositionsPacked = {
          positionRef: drawPosition(
            trade,
            hideVisulizations,
            widgetRef.current?.activeChart?.()
          ),
          option: trade,
        };
        po.push(currPositionsPacked);
      });
    }
    trade2visualisation.current = po;
    return po;
  };

  const renderPositions = async () => {
    deleteAllPostions();
    trade2visualisation.current = [];
    setVisualizedTrades(drawPositions());
  };

  useEffect(() => {
    const timeout = setInterval(async () => {
      await renderPositions();
    }, 1000);
    return () => clearInterval(timeout);
  }, [hideVisulizations, activeTrades, chartReady]);

  useEffect(() => {
    if (!chartReady) return;
    // widgetRef.current?.activeChart().removeAllShapes();
    widgetRef
      .current!.activeChart?.()
      .setChartType((chartType as any)?.[chartId] ?? 1);
  }, [chartType, chartReady]);
  useEffect(() => {
    if (!chartReady) return;
    widgetRef.current?.activeChart().removeAllShapes();
    // widgetRef
    //   .current!.activeChart?.()
    //   .setChartType((chartType as any)?.[chartId] ?? 1);
  }, [chartReady]);

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
    const interval = setInterval(() => {
      // console.log('[chart-0 intervalcalled');
      try {
        widgetRef.current?.save((d) => {
          setDrawing((drawing: any) => {
            return {
              ...drawing,
              [chartId]: d,
            };
          });
        });
      } catch (e) {
        console.log('[chart-bug]', e);
      }

      try {
        // console.log('[chart-1', trade2visualisation.current);
        trade2visualisation.current.forEach((trade) => {
          const actualTrade = trade.option;
          let updatedTrade = actualTrade;
          activeTrades.forEach((catagory) => {
            if (catagory === null) return;
            if (catagory.queueID && catagory.queueID === actualTrade.queueID) {
              updatedTrade = catagory;
            }
          });
        });
      } catch (e) {
        console.log('[chart-bug]', e);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [visualizedTrades]);

  const toggleIndicatorDD = (_: any) => {
    widgetRef.current!.activeChart?.().executeActionById('insertIndicator');
  };
  const futureInf = Date.now() / 1000 + 24 * 60 * 60;
  let time = futureInf;
  time = time;
  let rem = time % resolution2seconds[resolution];
  time = futureInf - rem;
  const from = returnMod(
    Date.now() / 1000 - 500 * 24 * 60 * 60,
    resolution2seconds[resolution]
  );
  const deleteOldDrawings = () => {
    if (shapeIdRef.current)
      widgetRef.current?.activeChart().removeEntity(shapeIdRef.current);
  };
  console.log(`MultiResolutionChart-time: `, time);
  const shapeIdRef = useRef('');
  console.log(`MultiResolutionChart-selectedStrike?.price: `, selectedStrike);
  useEffect(() => {
    if (selectedStrike?.price) {
      // above
      deleteOldDrawings();
      const points = selectedStrike.isAbove
        ? [
            {
              time: from,
              price: +selectedStrike.price,
            },
            {
              time,
              price: 1000000,
            },
          ]
        : [
            {
              time,
              price: +selectedStrike.price,
            },
            {
              time: from,
              price: 0,
            },
          ];
      if (
        shapeIdRef.current &&
        typeof widgetRef.current?.activeChart == 'function'
      )
        widgetRef.current?.activeChart().removeEntity(shapeIdRef.current);
      const id = widgetRef.current
        ?.activeChart()
        .createMultipointShape(points, {
          shape: 'rectangle',
          overrides: {
            backgroundColor: selectedStrike.isAbove
              ? defaults.upRectangeColor
              : defaults.downRectangeColor,
            linewidth: 0,
          },
        });
      shapeIdRef.current = id;
    } else {
      deleteOldDrawings();
    }
  }, [selectedStrike]);
  useEffect(() => {
    if (indicatorCount) toggleIndicatorDD('d');
  }, [indicatorCount]);

  return (
    <div className="flex flex-col w-full h-full">
      {!isMobile ? (
        <div className="items-center justify-between flex-row flex  bg-2 w-full tv-h px-4 ">
          <div className="flex flex-row justify-start font-[500]">
            <div className="ele cursor-pointer">Time</div>
            {supported_resolutions.map((s) => {
              return (
                <div
                  key={s}
                  onClick={async () => {
                    setMarket2resolution((m: any) => ({
                      ...m,
                      [chartId]: s,
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
                // console.log(`updatedType: `, updatedType);
                setChartType((ct: any) => ({ ...ct, [chartId]: updatedType }));
              }}
              active={(chartType as any)[chartId] ?? 1}
            />
            <button
              onClick={toggleIndicatorDD}
              className="flex flex-row mr-3 ele text-f12  font-[500] "
            >
              <ChartElementSVG className="mr-[3px]" /> Indicators
            </button>
          </div>
        </div>
      ) : null}
      <div className="w-full  flex-grow">
        <div
          ref={containerDivRef}
          id="chart-element-main"
          className="TVChartContainer w-[100%] h-[100%]"
        />
      </div>
    </div>
  );
};
