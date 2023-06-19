import DDArrow from '@SVG/Elements/Arrow';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import OngoingTradesTable from './OngoingTradesTable';
import LimitOrderTable from './LimitOrderTable';
import { useAtom } from 'jotai';
import { isTableShownAtom } from '@Views/TradePage/atoms';
import HistoryTable from './HistoryTable';
import PlatformTable from './PlatformTrades';
import { usePlatformTrades } from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import PlatformHistory from './PlatformHistory';
const tables = {
  Trades: 'h',
  'Limit Orders': 'h',
  History: 'h',
  'Platform Trades': 'h',
  'Platform History': 'h',
};
const gap = ['History'];

const AccordionTable: React.FC<any> = ({}) => {
  const [expanded, setExpanded] = useAtom(isTableShownAtom);
  const [activeTable, setActiveTable] = useState('Trades');
  return (
    <div className="flex flex-col ">
      <div className="w-full flex items-center  justify-between p-3">
        <div className="flex gap-x-[15px]">
          {Object.keys(tables).map((s) => (
            <button
              onClick={() => {
                setExpanded(true);
                setActiveTable(s);
              }}
              className={`text-${s == activeTable ? '1' : '2'} text-f14 ${
                gap.filter((i) => i == s).length
                  ? ' pr-[10px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              {s}
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
        } flex flex-col transition-all  overflow-y-hidden mx-3`}
      >
        {activeTable == 'Trades' ? (
          <OngoingTradesTable />
        ) : activeTable == 'Limit Orders' ? (
          <LimitOrderTable />
        ) : activeTable == 'Platform Trades' ? (
          <PlatformTable />
        ) : activeTable == 'Platform History' ? (
          <PlatformHistory />
        ) : (
          <HistoryTable />
        )}
      </div>
    </div>
  );
};

export { AccordionTable };
