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
import { useAtom, useAtomValue } from 'jotai';
import { atomWithLocalStorage } from '@Views/BinaryOptions/PGDrawer';
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
  ChartTypeSelectionDD,
} from '@TV/ChartTypeSelectionDD';
const PRICE_PROVIDER = 'Buffer Finance';
export let supported_resolutions = [
  '1S' as ResolutionString,
  '10S' as ResolutionString,
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
const drawingAtom = atomWithLocalStorage('TradingChartDrawingStorage', null);

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
  console.log(`color: `, color, text, tooltip);
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

export const TradingChart = ({ market }: { market: Markets }) => {
  const qtInfo = useQTinfo();
  const [chartConfigs, setChartConfigs] = useState({ resolution: '1' });

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
  const [chartType, setChartType] = useState(1);

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

  const datafeed = useMemo((): IBasicDataFeed => {
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
          const [assetBars, allPrices] = await Promise.all(bundle);
          const allPricesData = allPrices.data.data as LatestPriceApiRes;
          let mappedData: Partial<Market2Kline> = {};
          let keys = Object.keys(allPricesData);
          console.log(keys);
          if (allPricesData) {
            for (let a in allPricesData) {
              mappedData[a as Markets] = getOHLCfromPrice(
                allPricesData[a as Markets],
                allPricesData.timestamp as number
              );
            }
          }
          const tempData = assetBars.data[0].result as number[][];
          const query = assetBars.data[0].query;
          if (!tempData) return;
          tempData.forEach((bar, idx) => {
            bars = [...bars, getBlockFromBar(bar)];
          });

          const recentBar = bars[bars.length - 1];

          if (firstDataRequest && bars.length) {
            lastSyncedKline.current[
              getBarsFnActiveAsset + timeDeltaMapping(resolution)
            ] = recentBar;
            console.log(`lastSyncedKline: `, lastSyncedKline);
          }
          const isLastChunk =
            query.start_time / 1000 <= FIRST_TIMESTAMP ? true : false;

          onHistoryCallback(bars, {
            noData: isLastChunk,
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
      unsubscribeBars: (_) => {
        realTimeUpdateRef.current = null;
      },
    };
  }, []);
  const { active: activeTrades } = useAtomValue(tardesAtom);
  const [visualized] = useAtom(visualizeddAtom);

  useLayoutEffect(() => {
    const chart = new widget({
      datafeed,
      interval: defaults.interval,
      timeframe: '200',
      locale: 'en',
      container: containerDivRef.current!,
      library_path: defaults.library_path,
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
          title: '15Min',
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
    const key = market + timeDeltaMapping(activeResolution);
    let prevBar = lastSyncedKline?.current?.[key];
    if (!prevBar) return;
    const activeAssetStream = price[market];
    console.log(`price: `, price);
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
        realTimeUpdateRef.current.symbolInfo.name === market &&
        prevBar.time < aggregatedBar.time
      ) {
        realTimeUpdateRef.current.onRealtimeCallback(aggregatedBar);
        await sleep(document.hidden ? 1 : 30);
        prevBar = aggregatedBar;
      }
    }
  };

  // sync to ws updates
  useEffect(() => {
    syncTVwithWS();
  }, [price]);

  // draw positions.
  useEffect(() => {
    if (chartReady && activeTrades) {
      console.log(`activeTrades: `, activeTrades);
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
        console.log(`trade[mark]: `, trade, trade2visualisation);
        trade2visualisation.current[+trade]!.visited = false;
      }
    };
  }, [visualized, activeTrades, chartReady]);
  const updatePositionTimeLeft = useCallback(() => {
    // save drawings
    widgetRef.current?.save((d) => {
      setDrawing((drawing) => {
        return {
          ...drawing,
          [market]: d,
        };
      });
    });

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
    if (chartReady) widgetRef.current!.activeChart?.().setChartType(chartType);
  }, [chartType, chartReady]);

  useEffect(() => {
    if (
      chartReady &&
      widgetRef.current &&
      typeof widgetRef.current?.activeChart === 'function'
    ) {
      widgetRef.current
        .activeChart?.()
        .setResolution(chartConfigs.resolution as ResolutionString);
    }
  }, [chartConfigs.resolution, chartReady]);
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
    <>
      <div className="items-center justify-between flex-row flex  bg-[#131722] w-full tv-h px-4 py-3">
        <div className="flex flex-row justify-start font-[500]">
          <div className="ele cursor-pointer">Time</div>
          {supported_resolutions.map((s) => {
            return (
              <div
                onClick={() => {
                  setChartConfigs({ ...chartConfigs, resolution: s });
                }}
                className={`${
                  s.toLowerCase() == chartConfigs.resolution.toLowerCase() &&
                  'active'
                } ${isntAvailable(s) && 'tb'} ele cursor-pointer`}
              >
                {formatResolution(s)}
              </div>
            );
          })}
        </div>
        <div className="flex">
          <ChartTypeSelectionDD setActive={setChartType} active={chartType} />
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
    </>
  );
};
