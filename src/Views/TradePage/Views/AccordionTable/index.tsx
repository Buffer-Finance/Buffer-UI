import DDArrow from '@SVG/Elements/Arrow';
import { getCachedPrice } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useCancelledTrades } from '@Views/TradePage/Hooks/useCancelledTrades';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import {
  usePlatformActiveTrades,
  usePlatformCancelledTrades,
  usePlatformHistoryTrades,
} from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import {
  cancelTableActivePage,
  historyTableActivePage,
  isTableShownAtom,
  platformActiveTableActivePage,
  platformCancelTableActivePage,
  platformHistoryTableActivePage,
  queuets2priceAtom,
} from '@Views/TradePage/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { CancelledTable } from './CancelTable';
import { HistoryTable } from './HistoryTable';
import LimitOrderTable from './LimitOrderTable';
import { OngoingTradesTable } from './OngoingTradesTable';

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
      let newP: { [key: number]: number } = { ...p };
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
          <OngoingTradesTable
            trades={activeTrades}
            isLoading={false}
            overflow
          />
        ) : activeTable == 'Limit Orders' ? (
          <LimitOrderTable trades={limitOrders} overflow />
        ) : activeTable == 'Platform Trades' ? (
          <PlatformOngoing />
        ) : activeTable == 'Platform History' ? (
          <PlatformHistory overflow />
        ) : activeTable == 'Cancelled' ? (
          <Cancelled />
        ) : (
          <History overflow />
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

export const History = ({
  onlyView,
  className = '',
  overflow,
}: {
  onlyView?: number[];
  className?: string;
  overflow: boolean;
}) => {
  const { page_data: historyTrades, total_pages } = useHistoryTrades();
  const [activePage, setActivePage] = useAtom(historyTableActivePage);

  return (
    <HistoryTable
      trades={historyTrades}
      totalPages={total_pages}
      activePage={activePage}
      setActivePage={setActivePage}
      onlyView={onlyView}
      isLoading={historyTrades === undefined}
      className={className}
      overflow={overflow}
    />
  );
};

export const Cancelled = ({
  onlyView,
  className = '',
}: {
  onlyView?: number[];
  className?: string;
}) => {
  const { page_data: canclledTrades, total_pages } = useCancelledTrades();
  const [activePage, setActivePage] = useAtom(cancelTableActivePage);

  return (
    <CancelledTable
      trades={canclledTrades}
      totalPages={total_pages}
      onlyView={onlyView}
      isLoading={canclledTrades === undefined}
      className={className}
      activePage={activePage}
      setActivePage={setActivePage}
    />
  );
};

export const PlatformHistory = ({
  onlyView,
  className = '',
  overflow,
}: {
  onlyView?: number[];
  className?: string;
  overflow: boolean;
}) => {
  const { page_data: platformHistoryTrades, total_pages } =
    usePlatformHistoryTrades();
  const [activePage, setActivePage] = useAtom(platformHistoryTableActivePage);

  return (
    <HistoryTable
      trades={platformHistoryTrades}
      platform
      totalPages={total_pages}
      activePage={activePage}
      setActivePage={setActivePage}
      onlyView={onlyView}
      isLoading={platformHistoryTrades === undefined}
      overflow={overflow}
      className={className}
    />
  );
};

export const PlatformOngoing = ({
  onlyView,
  className = '',
  overflow = true,
}: {
  onlyView?: number[];
  className?: string;
  overflow?: boolean;
}) => {
  const { page_data: platformActiveTrades, total_pages } =
    usePlatformActiveTrades();
  const [activePage, setActivePage] = useAtom(platformActiveTableActivePage);

  useEffect(() => {
    if (platformActiveTrades !== undefined && activePage > total_pages) {
      console.log(activePage, total_pages, 'this ran');
      setActivePage(1);
    }
  }, [total_pages]);

  return (
    <OngoingTradesTable
      trades={platformActiveTrades}
      platform
      activePage={activePage}
      totalPages={total_pages}
      setActivePage={setActivePage}
      onlyView={onlyView}
      isLoading={platformActiveTrades === undefined}
      overflow={overflow}
      className={className}
    />
  );
};

export const PlatfromCancelled = ({
  onlyView,
  className = '',
  overflow,
}: {
  onlyView?: number[];
  className?: string;
  overflow: boolean;
}) => {
  const { page_data: canclledTrades, total_pages } =
    usePlatformCancelledTrades();
  const [activePage, setActivePage] = useAtom(platformCancelTableActivePage);

  return (
    <CancelledTable
      trades={canclledTrades}
      activePage={activePage}
      setActivePage={setActivePage}
      totalPages={total_pages}
      onlyView={onlyView}
      isLoading={canclledTrades === undefined}
      className={className}
      overflow={overflow}
      platform
    />
  );
};
