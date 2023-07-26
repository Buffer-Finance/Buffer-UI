import DDArrow from '@SVG/Elements/Arrow';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useEffect, useState } from 'react';
import LimitOrderTable from './LimitOrderTable';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isTableShownAtom, queuets2priceAtom } from '@Views/TradePage/atoms';
import {
  usePlatformActiveTrades,
  usePlatformHistoryTrades,
} from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import { OngoingTradesTable } from './OngoingTradesTable';
import { HistoryTable } from './HistoryTable';
import { getCachedPrice } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useCancelledTrades } from '@Views/TradePage/Hooks/useCancelledTrades';
import { CancelledTable } from './CancelTable';

const tables = {
  Trades: 'h',
  'Limit Orders': 'h',
  History: 'h',
  Cancelled: 'h',
  'Platform Trades': 'h',
  'Platform History': 'h',
};
const gap = ['Cancelled'];

const AccordionTable: React.FC<any> = ({}) => {
  const [expanded, setExpanded] = useAtom(isTableShownAtom);
  const [activeTrades, limitOrders] = useOngoingTrades();
  const setPriceCache = useSetAtom(queuets2priceAtom);
  const priceCache = useAtomValue(queuets2priceAtom);

  const [activeTable, setActiveTable] = useState('Trades');
  const getAugmentedData = async (
    queries: { pair: string; timestamp: number; queueId: number }[]
  ) => {
    const priceResponse = await Promise.all(
      queries.map((q) => getCachedPrice(q))
    );
    setPriceCache((p) => {
      let newP = { ...p };
      queries.forEach((q, i) => {
        newP[q.queueId] = priceResponse[i];
      });
      return newP;
    });
  };

  useEffect(() => {
    const priceQueries: { pair: string; timestamp: number; queueId: number }[] =
      [];
    activeTrades.forEach((trade) => {
      if (trade.state == 'QUEUED') {
        if (trade.market) {
          if (!(trade.queue_id in priceCache))
            priceQueries.push({
              pair: trade.market.tv_id,
              timestamp: trade.open_timestamp,
              queueId: trade.queue_id,
            });
        }
      }
    });
    getAugmentedData(priceQueries);
  }, [activeTrades.length]);

  return (
    <div className="flex flex-col    ">
      <div className="w-full bg-[#282B39] rounded-[2px] flex items-center  justify-between p-3 ">
        <div className="flex gap-x-[15px]">
          {Object.keys(tables).map((s) => (
            <button
              onClick={() => {
                setExpanded(true);
                setActiveTable(s);
              }}
              key={s}
              className={`text-${s == activeTable ? '1' : '2'} text-f14 ${
                gap.filter((i) => i == s).length
                  ? ' pr-[13px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              <div className="flex items-center gap-x-2">
                {s}
                {s == 'Trades' && activeTrades.length ? (
                  <CountChip count={activeTrades.length} />
                ) : s == 'Limit Orders' && limitOrders.length ? (
                  <CountChip count={limitOrders.length} />
                ) : null}
              </div>
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-x-2 px-4 text-f14 transition group"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? 'Hide ' : 'Show '} Positions{' '}
          <DDArrow
            className={`transition scale group-hover:scale-150  ${
              expanded ? ' rotate-0' : 'rotate-180'
            }`}
          />
        </button>
      </div>
      <div
        className={` ${
          expanded ? 'h-[355px]' : 'h-[0px]'
        } flex flex-col transition-all  overflow-y-hidden `}
      >
        {activeTable == 'Trades' ? (
          <OngoingTradesTable trades={activeTrades} />
        ) : activeTable == 'Limit Orders' ? (
          <LimitOrderTable trades={limitOrders} />
        ) : activeTable == 'Platform Trades' ? (
          <PlatformOngoing />
        ) : activeTable == 'Platform History' ? (
          <PlatformHistory />
        ) : activeTable == 'Cancelled' ? (
          <Cancelled />
        ) : (
          <History />
        )}
      </div>
    </div>
  );
};

export { AccordionTable };

const CountChip = ({ count }: { count: number }) => (
  <div className="text-[#C3C2D4] mt-1 bg-[#171722] text-f10 h-[16px] p-2 pt-[0px] pb-[">
    <span>{count}</span>
  </div>
);

const History = () => {
  const [historyTrades] = useHistoryTrades();

  return <HistoryTable trades={historyTrades} />;
};

const Cancelled = () => {
  const [canclledTrades] = useCancelledTrades();

  return <CancelledTable trades={canclledTrades} />;
};

const PlatformHistory = () => {
  const platformHistoryTrades = usePlatformHistoryTrades();
  return <HistoryTable trades={platformHistoryTrades} platform />;
};

const PlatformOngoing = () => {
  const platformActiveTrades = usePlatformActiveTrades();
  return <OngoingTradesTable trades={platformActiveTrades} platform />;
};
