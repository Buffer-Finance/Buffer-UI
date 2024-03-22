import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  getPriceFromKlines,
  marketPriceAtom,
  streamBreakedAtom,
  TVStateAtom,
} from './useDataFeed';
import { UserActivityAtom } from '@Utils/isUserPaused';

import { Variables } from '@Utils/Time';
import { widget } from '../../public/static/charting_library';
import { sessionAtom } from 'src/atoms/generic';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { visualizeddAtom } from '@Views/BinaryOptions/Tables/Desktop';
import { supported_resolutions } from './useDataFeed';
const defaults = {
  library_path: '/static/charting_library/',
  theme: 'dark',
  interval: '1',
};
import { chartReadyAtom } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
const BG = 'rgb(48, 48, 68)';
const Up = '▲';
const Down = '▼';
const green = 'rgb(108, 211, 173)';
const red = 'rgb(255, 104, 104)';
import { formatDistance as formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
const basicDisabled = [
  'header_compare',
  'header_symbol_search',
  'header_widget',
];
import { getIdentifier } from '@Hooks/useGenericHook';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { useQTinfo } from '@Views/BinaryOptions';
import TZ from './TZ.json';
import { toFixed } from '@Utils/NumString';
import { PRICE_DECIMALS } from '@Views/BinaryOptions/Tables/TableComponents';
import { BetState } from '@Hooks/useAheadTrades';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { ChartTypeSelectionDD } from './ChartTypeSelectionDD';
import { Dialog } from '@mui/material';
import { BlueBtn } from '@Views/Common/V2-Button';

const drawingAtom = atomWithStorage('TVL_V2_CONFIG', null);

const getColor = (cp, sp, isAbove) => {
  // let color;
  // if (cp < sp) {
  //   color = isAbove ? red : green;
  // } else {
  //   color = !isAbove ? red : green;
  // }
  return !isAbove ? red : green;
};

function drawPosition(option, visualized, chart, cp, positions) {
  let vizIdentifiers = getIdentifier(option);
  const idx = visualized.indexOf(vizIdentifiers);
  const openTimeStamp = option.creationTime;
  const optionPrice = +option.strike / PRICE_DECIMALS;
  if (idx === -1 && option.state === BetState.active && optionPrice) {
    let color = getColor(cp, option.strike, option.isAbove);

    let line = chart
      ?.createPositionLine()
      .setText(
        `${toFixed(
          divide(option.totalFee?.toString(), option.depositToken.decimals),
          2
        )} ${option.depositToken.name} | ` + getText(option.expirationTime)
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
    positions.current.push({ line, expiration: option.expirationTime });
  }
}

function getOslonTimezone() {
  const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const found = TZ.find((tz) => {
    return tz.IANA == ianaTimezone;
  });
  return found?.OSLON || 'Etc/UTC';
}

const TVIntegrated = ({ assetInfo, className }) => {
  let positions = useRef([]);
  const chartElementRef = useRef();
  const [chartReady, setChartReady] = useAtom(chartReadyAtom);
  const [token] = useAtom(sessionAtom);
  const [marketPrices, setMarketPrices] = useAtom(marketPriceAtom);
  const [drawing, setDrawing] = useAtom(drawingAtom);
  const [visualized] = useAtom(visualizeddAtom);
  const { active: data, history } = useAtomValue(tardesAtom);
  const [chartConfigs, setChartConfigs] = useState({ resolution: '1' });
  const qtInfo = useQTinfo();
  const [chartType, setChartType] = useState(1);

  const { state } = useGlobal();

  const widgetRef = useRef();
  const [datafeeds, realTimeUpdate] = useDataFeed(chartReady);
  const activeMarket = qtInfo.activePair;
  // asset change
  useEffect(() => {
    if (!assetInfo) return;
    if (
      chartReady &&
      widgetRef.current &&
      typeof widgetRef.current?.activeChart === 'function'
    ) {
      setChartReady((c) => false);
      // widgetRef.current.activeChart().resetData();

      widgetRef.current?.activeChart?.().setSymbol(assetInfo.tv_id, () => {
        setChartReady((c) => true);
      });
      return;
    }
    setChartReady((chart) => false);

    widgetRef.current = new widget({
      datafeed: datafeeds,
      interval: defaults.interval,
      timeframe: '200',
      container: chartElementRef.current,
      library_path: defaults.library_path,
      timezone: getOslonTimezone(),
      symbol: assetInfo.tv_id,
      theme: defaults.theme,
      enabled_features: ['header_saveload'],
      supported_resolutions,
      // supported_resolutions: ["1s", "2s", "1", "3"],
      load_last_chart: true,
      time_frames: [
        {
          text: '1D',
          resolution: '30',
          description: '1 Day look back',
          title: '1D',
        },
        {
          text: '4H',
          resolution: 5,
          description: '4 Hour look back',
          title: '4H',
        },
        {
          text: '1H',
          resolution: 1,
          description: '1 Hour look back',
          title: '1H',
        },
        {
          text: '30',
          resolution: 1,
          description: '30 Minute look back',
          title: '30Min',
        },
        {
          text: '10',
          resolution: '1S',
          description: '10 Minute look back',
          title: '15Min',
        },
      ],
      saved_data: drawing,
      disabled_features:
        window.innerWidth < 600
          ? ['left_toolbar', ...basicDisabled]
          : [...basicDisabled],
    });

    setMarketPrices((mp) => {});
    widgetRef.current.onChartReady(() => {
      // if (drawing && Object.keys(drawing).length) {
      // widgetRef.current.load(drawing);
      // widgetRef.current.getSavedCharts((charts) => {
      // });
      const isDrawerOpen = widgetRef.current
        .activeChart()
        .getCheckableActionState('drawingToolbarAction');
      isDrawerOpen &&
        widgetRef.current
          .activeChart?.()
          .executeActionById('drawingToolbarAction');
      widgetRef.current.activeChart?.().setTimezone(getOslonTimezone());
      setChartReady((chart) => true);
      // }
    });
  }, [assetInfo, setChartReady]);
  const toggleIndicatorDD = (r) => {
    widgetRef.current.activeChart?.().executeActionById('insertIndicator');
  };
  useEffect(() => {
    if (chartReady) widgetRef.current.activeChart?.().setChartType(chartType);
  }, [chartType, chartReady]);

  // dont know
  // setTZ
  const isntAvailable = (s) => {
    return (
      s &&
      ['1s', '10s', '5m', '60', '120', '240', '1d'].includes(s.toLowerCase())
    );
  };
  const [breakingCnt, setBreakingCnt] = useAtom(streamBreakedAtom);
  // resolution syncing
  useEffect(() => {
    if (
      chartReady &&
      widgetRef.current &&
      typeof widgetRef.current?.activeChart === 'function'
    ) {
      widgetRef.current.activeChart?.().setResolution(chartConfigs.resolution);
    }
  }, [chartConfigs.resolution, chartReady]);
  useEffect(() => {
    setChartReady(false);
    return () => {
      setChartReady(false);
    };
  }, []);

  useEffect(() => {
    console.log('stream-err1', breakingCnt, chartReady);
    if (breakingCnt.state != 'break') return;
    if (!chartReady) return;
    const chart = widgetRef?.current?.activeChart?.();
    console.log('stream-err2', chart);

    realTimeUpdate.current?.onResetCacheNeededCallback();
    chart.resetData();
    setBreakingCnt({ state: 'active' });
  }, [breakingCnt]);
  useLayoutEffect(() => {
    setChartReady(false);
  }, [state.tabs.activeIdx]);
  // positions visualisations
  const val = useAtomValue(UserActivityAtom);
  const setVal = useSetAtom(UserActivityAtom);
  const [tvState, setState] = useAtom(TVStateAtom);
  const [showPauseModal, setShowPasuseModal] = useState(false);
  useEffect(() => {
    if (!chartReady) return;
    console.log(`[tv-status]: `, tvState, val);
    if (tvState.type != 'stale') return;
    setShowPasuseModal(true);
  }, [val, tvState, chartReady]);
  useEffect(() => {
    let timers = [];

    if (
      chartReady &&
      data &&
      activeMarket &&
      widgetRef.current &&
      typeof widgetRef.current?.activeChart === 'function'
    ) {
      positions.current.map((pos) => {
        pos?.line?.remove();
      });

      positions.current = [];

      data.map((option) => {
        if (
          option?.configPair?.pair.toLowerCase() !==
          activeMarket.pair.toLowerCase()
        )
          return;
        timers.push(
          setTimeout(() => {
            drawPosition(
              option,
              visualized,
              widgetRef.current?.activeChart?.(),
              getPriceFromKlines(marketPrices, activeMarket),
              positions
            );
          })
        );
      });
    }
    return () => {
      for (let timer of timers) {
        clearTimeout(timer);
      }
    };
  }, [visualized, data, chartReady, activeMarket]);
  const updateTimeLeft = () => {
    positions.current.map((pos) => {
      const inv = pos?.line?.getText()?.split('|')[0];
      const strikePrice = pos?.line?.getPrice();
      const text = inv + '| ' + getText(pos.expiration);
      pos.line?.setText(text);
      const marketPrice = getPriceFromKlines(marketPrices, activeMarket);
      if (marketPrice && strikePrice) {
        const isAbove = pos.line.getQuantity() == Up;
        let color = getColor(marketPrice, strikePrice, isAbove);

        pos.line?.setQuantityBackgroundColor(color);
        pos.line?.setQuantityBorderColor(color);
        pos.line.setLineColor(color);
        // pos.line?.setBodyBorderColor(color);

        // pos.line?.setQuantityTextColor(color);
        // pos.line.setBodyTextColor(color);
      }
    });
  };

  // position updation
  useEffect(() => {
    let timeout;
    if (
      chartReady &&
      data &&
      activeMarket &&
      widgetRef.current &&
      typeof widgetRef.current.activeChart === 'function'
    ) {
      timeout = setInterval(() => {
        updateTimeLeft();
      }, 1000);
    }
    return () => clearInterval(timeout);
  }, [chartReady]);

  useEffect(() => {
    return setChartReady(false);
  }, [setChartReady]);

  // autosaving
  useEffect(() => {
    let interval;
    if (chartReady) {
      interval = setInterval(() => {
        widgetRef.current?.save((d) => {
          setDrawing(d);
        });
        // updatePositions(visualized, widgetRef.current);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [setDrawing, chartReady]);
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

  return <div></div>;
};

function expectedTimer(timer) {
  // let arr = [
  //   timer.days && {
  //     name: "Days",
  //     value: timer.days,
  //   },
  //   (timer.hours || timer.days) && {
  //     name: "Hours",
  //     value: timer.hours,
  //   },
  //   {
  //     name: "Minutes",
  //     value: timer.minutes,
  //   },
  //   {
  //     name: "Seconds",
  //     value: timer.seconds,
  //   },
  // ];
  function f(d, string) {
    return d ? string : '';
  }
  const time = `${f(timer.days, timer.days + ' days ')}${f(
    timer.hours || timer.days,
    timer.hours + ' hours '
  )}${f(timer.minutes, timer.minutes + ' minutes')}`;
  return `Expires in ${time.replaceAll(' ', '') == '' ? 'few seconds.' : time}`;
}

function getText(expiration) {
  const curr = Math.round(Date.now() / 1000);
  return `${
    expiration <= curr
      ? 'Processing...'
      : `${formatDistanceExpanded(
          Variables(expiration - Math.round(Date.now() / 1000))
        )}`
  }`;
}

const useResizeObserver = (refs, cb, delay = 0) => {
  const memoizedCb = useCallback(cb, []);
  const resizeObserverRef = useRef(new ResizeObserver(memoizedCb));
  useEffect(() => {
    refs.forEach((ref) => {
      if (ref.current) resizeObserverRef.current.observe(ref.current);
    });
  }, [...refs]);
};

export default TVIntegrated;

import * as React from 'react';
import { atomWithStorage } from 'jotai/utils';

const ChartElementSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    className="css-9698k2"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 20h3v-6.791l3.767-3.767.967.966 1.767 1.768 6.364-6.364-1.767-1.768-4.596 4.596-.967-.966-1.768-1.768L7 9.673V4H4v16zm16 0H7v-3h13v3zm-6.5-7.823 2.828 2.828h-5.656l2.828-2.828z"
      fill="currentColor"
    />
  </svg>
);
