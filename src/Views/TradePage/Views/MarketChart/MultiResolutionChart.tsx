import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Markets, OHLCBlock, RealtimeUpdate } from './MakrketTypes';
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
  IOrderLineAdapter,
} from '../../../../../public/static/charting_library';
import axiosRetry from 'axios-retry';

import {
  getDisplayDate,
  getDisplayTime,
  getOslonTimezone,
} from '@Utils/Dates/displayDateTime';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getAggregatedBarv2, timeDeltaMapping } from '@TV/utils';
import axios from 'axios';
import { priceAtom } from '@Hooks/usePrice';
import { sleep } from '@Utils/JSUtils/sleep';
import { toFixed } from '@Utils/NumString';
import { divide, multiply, round } from '@Utils/NumString/stringArithmatics';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { useUserAccount } from '@Hooks/useUserAccount';
import {
  ChartElementSVG,
  ChartTypePersistedAtom,
  ChartTypeSelectionDD,
} from '@TV/ChartTypeSelectionDD';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { TradeType } from '@Views/TradePage/type';
import {
  closeConfirmationModalAtom,
  miscsSettingsAtom,
  queuets2priceAtom,
  rerenderPositionAtom,
  selectedOrderToEditAtom,
  tradeSettingsAtom,
  tradeTypeAtom,
  visualizeddAtom,
} from '@Views/TradePage/atoms';
import { atomWithStorage } from 'jotai/utils';
import { PRICE_DECIMALS } from '@Views/TradePage/config';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { marketsForChart } from '@Views/TradePage/config';
import { getEarlyCloseStatus } from '../AccordionTable/Common';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { useLimitOrderHandlers } from '@Views/TradePage/utils/useLimitOrderHandlers';
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
const pythClient = axios.create({ baseURL: 'https://benchmarks.pyth.network' });
axiosRetry(pythClient, { retries: 3 });

const isntAvailable = (s: string | null) => {
  return (
    s && ['1s', '10s', '5m', '60', '120', '240', '1d'].includes(s.toLowerCase())
  );
};
const formatResolution = (s: string) => {
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
function getText(option: TradeType) {
  const expiration = option.expiration_time!;
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
  // console.log(`pythOHLC: `, pythOHLC);
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
const drawingAtom = atomWithStorage('TradingChartDrawingStorage-v2', null);
const market2resolutionAtom = atomWithStorage(
  'TradingChartDrawingStorage-market2resolutionAtom',
  null
);
function drawPosition(
  option: TradeType,
  loHandlers: {
    onEdit: () => void;
    onCancel: () => void;
    onMove: (trade: TradeType, strike: string) => void;
  },
  chart: IChartWidgetApi,
  decimals: number
) {
  // const idx = visualized.indexOf(option.queue_id);
  const openTimeStamp = option.open_timestamp;
  const optionPrice = +option.strike / PRICE_DECIMALS;
  let color = !option.is_above ? defaults.red : defaults.green;

  if (option.is_limit_order && option.state == 'QUEUED') {
    const text = `${toFixed(
      divide(option.trade_size?.toString(), decimals)!,
      2
    )} ${option.token} | ${
      option.is_above ? defaults.upIcon : defaults.downIcon
    }`;

    return chart
      ?.createOrderLine()
      .setText('Limit | ' + text)
      .setTooltip('Drag to change Strike')
      .setBodyBackgroundColor(defaults.BG)
      .setQuantityBackgroundColor(color)
      .setBodyFont('normal 17pt Relative Pro')
      .setQuantityFont('bold 27pt Relative Pro')
      .setBodyTextColor('rgb(255,255,255)')
      .setCancelTooltip('Click to cancel this Limit Order')
      .setQuantity('↕')
      .setBodyBorderColor(defaults.BG)
      .setLineColor(color)
      .onMove('move', function () {
        console.log(this.getPrice());
        loHandlers.onMove(option, this.getPrice());
      })
      .setModifyTooltip('Click to Edit Order')
      .onModify('modify', function () {
        loHandlers.onEdit({ trade: option, market: option.market });
      })
      .onCancel('modify', function () {
        loHandlers.onCancel(option);
      })

      .setPrice(optionPrice);
  }

  const text =
    `${toFixed(divide(option.trade_size?.toString(), decimals)!, 2)} ${
      option.token
    } | ` + getText(option);
  const tooltip = `${getDisplayDate(openTimeStamp as any)}, ${getDisplayTime(
    openTimeStamp
  )} - ${getDisplayDate(option.close_time as any)}, ${getDisplayTime(
    option.expiration_time
  )}`;

  return chart
    ?.createOrderLine()
    .setText(text)
    .setTooltip(tooltip)
    .setBodyBackgroundColor(defaults.BG)
    .setQuantityBackgroundColor(color)
    .setBodyBorderColor(defaults.BG)
    .setBodyFont('normal 17pt Relative Pro')
    .setQuantityFont('bold 17pt Relative Pro')
    .setLineColor(color)
    .setBodyTextColor('rgb(255,255,255)')
    .setQuantity(option.is_above ? defaults.upIcon : defaults.downIcon)
    .setCancelTooltip('Click to Early Close at Market Price')
    .setPrice(optionPrice);

  // return chart
  //   ?.createPositionLine()
  //   .setText(text)
  //   .setTooltip(tooltip)
  //   .setBodyBackgroundColor(defaults.BG)
  //   .setBodyBorderColor(defaults.BG)
  //   .setBodyFont('normal 17pt Relative Pro')
  //   .setQuantityFont('bold 17pt Relative Pro')
  //   .setQuantityBackgroundColor(color)
  //   .setQuantityBorderColor(color)
  //   .setLineColor(color)
  //   .setBodyTextColor('rgb(255,255,255)')
  //   .setQuantity(option.is_above ? defaults.upIcon : defaults.downIcon)
  //   .setPrice(optionPrice)
  //   .onClose('onClose called', function (text) {
  //     this.setText(text);
  //   });
  // positions.current.push({ line, expiration: option.expirationTime });
}

export const MultiResolutionChart = ({
  market: marke,
  index,
  isMobile,
}: {
  market: Markets;
  index: number;
  isMobile?: boolean;
}) => {
  const { earlyCloseHandler } = useCancelTradeFunction();

  const market = marke.replace('-', '');
  const chartData =
    marketsForChart[market as unknown as keyof typeof marketsForChart];

  const [market2resolution, setMarket2resolution] = useAtom(
    market2resolutionAtom
  );
  const settings = useAtomValue(miscsSettingsAtom);
  const setCloseConfirmationModal = useSetAtom(closeConfirmationModalAtom);

  const { getPoolInfo } = usePoolInfo();
  const chartId = market + index;
  const v3AppConfig = useMarketsConfig();
  const { address } = useUserAccount();
  const [chartReady, setChartReady] = useState<boolean>(false);
  const lastSyncedKline = useRef<{ [asset: string]: OHLCBlock }>({});
  let trade2visualisation = useRef<
    Partial<{
      [key: string]: {
        option: TradeType;
        visited: boolean;
        lineRef: IOrderLineAdapter;
      };
    }>
  >({});
  const activeTrades = useOngoingTrades();
  let realTimeUpdateRef = useRef<RealtimeUpdate | null>(null);
  let widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useAtom(drawingAtom);
  const chartType = useAtomValue(ChartTypePersistedAtom);
  const setChartType = useSetAtom(ChartTypePersistedAtom);
  const setSelectedTradeToEdit = useSetAtom(selectedOrderToEditAtom);

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
  const { cancelHandler } = useCancelTradeFunction();

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
          console.log('pyth-deb', req);
          console.time('pyth-deb');
          const pythOHLC = await pythClient.get(
            `v1/shims/tradingview/history`,
            {
              params: req,
            }
          );
          console.timeEnd('pyth-deb');
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
  const [visualized] = useAtom(visualizeddAtom);
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
        // create_volume_indicator_by_default: false,
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
    // console.log(`[deb]1activeResolution: `, activeResolution);

    const key = market + timeDeltaMapping(activeResolution);
    const newpythId =
      chartData.pythGroup + '.' + chartData.token0 + '/' + chartData.token1;
    const newpythIdKey = newpythId + timeDeltaMapping(activeResolution);
    // console.log(`[deb]2key: `, key);
    let prevBar = lastSyncedKline?.current?.[newpythIdKey];
    // console.log(
    //   `[deb]3prevBar: `,
    //   prevBar,
    //   newpythId,
    //   lastSyncedKline.current,
    //   price
    // );
    if (!prevBar) return;
    const activeAssetStream = (price as any)[market];
    // console.log(`[deb]4price: `, activeAssetStream);
    if (!activeAssetStream?.length) return;
    let aggregatedBar;

    for (let currBar of activeAssetStream) {
      aggregatedBar = getAggregatedBarv2(
        prevBar,
        currBar,
        realTimeUpdateRef.current?.resolution
      );
      // console.log(
      //   `[deb]5aggregatedBar: `,
      //   aggregatedBar,
      //   realTimeUpdateRef.current.symbolInfo.name
      // );
      if (
        aggregatedBar &&
        realTimeUpdateRef.current.symbolInfo &&
        realTimeUpdateRef.current.symbolInfo.name === newpythId
      ) {
        try {
          realTimeUpdateRef.current.onRealtimeCallback(aggregatedBar);
        } catch (err) {
          // console.log('[sync]error white updating', err);
        }
        // await sleep(document.hidden ? 1 : 30);
        prevBar = aggregatedBar;

        lastSyncedKline.current[newpythIdKey] = prevBar;
      }
    }
  };
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const rerenderPostion = useAtomValue(rerenderPositionAtom);
  const { changeStrike } = useLimitOrderHandlers();
  const changeStrikeSafe = (trade: TradeType, strike: string) => {
    if (settings.loDragging) {
      changeStrike(trade, strike);
    } else {
      setSelectedTrade({
        trade,
        market: trade.market,
        default: { strike: round(multiply(strike, 8), 0)! },
      });
    }
  };
  // sync to ws updates
  useEffect(() => {
    syncTVwithWS();
  }, [(price as any)?.[market]]);
  const getTradeToDrawingId = (trade: TradeType) =>
    trade.queue_id + ':' + trade.strike;
  // draw positions.
  useEffect(() => {
    // trade2visualisation.current = {};
    for (const trade in trade2visualisation.current) {
      // mark all them
      trade2visualisation.current[trade]!.lineRef.remove();

      delete trade2visualisation.current[trade];
    }
  }, [rerenderPostion, settings.loDragging]);
  useEffect(() => {
    // if()
    if (chartReady && activeTrades) {
      activeTrades.forEach((trades) =>
        trades.forEach((pos) => {
          if (pos.is_above === undefined) return;
          if (!pos?.queue_id) return;
          if (visualized.includes(pos.queue_id)) return;
          if (trade2visualisation.current[getTradeToDrawingId(pos)]) {
            trade2visualisation.current[getTradeToDrawingId(pos)]!.visited =
              true;
          } else {
            if (
              pos.state === 'QUEUED' &&
              !pos.is_limit_order &&
              !priceCache?.[pos.queue_id]
            )
              return;
            let updatedPos = pos;
            if (pos.state === 'QUEUED' && !pos.is_limit_order) {
              updatedPos.strike = priceCache[pos.queue_id];
              updatedPos.expiration_time = pos.open_timestamp + pos.period;
            }
            console.log('drawing-deb', updatedPos);
            trade2visualisation.current[getTradeToDrawingId(pos)] = {
              visited: true,
              lineRef: drawPosition(
                updatedPos,
                {
                  onEdit: setSelectedTradeToEdit,
                  onCancel: cancelHandler,
                  onMove: changeStrikeSafe,
                },
                widgetRef.current?.activeChart()!,
                getPoolInfo(pos.pool.pool).decimals
              ),
              option: pos,
            };
          }
        })
      );
    }
    for (const trade in trade2visualisation.current) {
      // mark all them
      if (!trade2visualisation.current[trade]?.visited) {
        trade2visualisation.current[trade]!.lineRef.remove();

        delete trade2visualisation.current[trade];
      }
    }

    return () => {
      // mark all them not visited.
      for (const trade in trade2visualisation.current) {
        trade2visualisation.current[trade]!.visited = false;
      }
    };
  }, [
    visualized,
    activeTrades,
    chartReady,
    priceCache,
    rerenderPostion,
    settings.earlyCloseConfirmation,
    settings.loDragging,
  ]);
  useEffect(() => {
    console.log(`drawing-deb-changed${activeTrades}`);
  }, [activeTrades]);

  useEffect(() => {
    if (!chartReady) return;
    widgetRef
      .current!.activeChart?.()
      .setChartType((chartType as any)?.[chartId] ?? 1);
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
    const interval = setInterval(() => {
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
        console.log('major-bug', e);
      }

      for (const trade in trade2visualisation.current) {
        if (trade2visualisation.current[trade]?.visited) {
          console.log(`[ec-deb]t: `, trade);
          const [isDisabled, disableTooltip] = getEarlyCloseStatus(
            trade2visualisation.current[trade]?.option
          );
          const actualTrade = trade2visualisation.current[trade]?.option;
          let updatedTrade = actualTrade;
          activeTrades.forEach((catagory) => {
            catagory.forEach((t) => {
              if (t.queue_id == actualTrade?.queue_id) {
                updatedTrade = t;
              }
            });
          });

          // skip limit orderes
          if (updatedTrade?.state == 'QUEUED') return;

          const inv = trade2visualisation.current[trade]?.lineRef
            ?.getText()
            ?.split('|')[0];
          const text =
            inv +
            '| ' +
            getText((trade2visualisation.current as any)[trade]?.option);

          trade2visualisation.current[trade]?.lineRef.setText(text);
          if (!isDisabled) {
            trade2visualisation.current[trade]?.lineRef.onCancel(
              'onCancel',
              () => {
                console.log(`[ec-deb]k: `, updatedTrade);

                if (settings.earlyCloseConfirmation) {
                  earlyCloseHandler(updatedTrade, updatedTrade.market);
                } else {
                  setCloseConfirmationModal(updatedTrade);
                }
              }
            );
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [address, settings.earlyCloseConfirmation, activeTrades]);

  const toggleIndicatorDD = (_: any) => {
    widgetRef.current!.activeChart?.().executeActionById('insertIndicator');
  };

  return (
    <div className="flex flex-col w-full h-full">
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

// async function callApi(req) {
//   let retry = 1;
//   const getRes = async () => {
//     try {
//       const res = await axios.get(
//         `https://benchmarks.pyth.network/v1/shims/tradingview/history`,
//         {
//           params: req,
//         }
//       );
//     } catch (err) {
//       if (retry < 5) {
//         await sleep(22);
//         retry++;
//         getRes();
//       } else {
//         return null;
//       }
//     }
//   };
//   return getRes;
// }
