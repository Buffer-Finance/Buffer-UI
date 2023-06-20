import DDArrow from '@SVG/Elements/Arrow';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useState } from 'react';
import LimitOrderTable from './LimitOrderTable';
import { useAtom } from 'jotai';
import { isTableShownAtom } from '@Views/TradePage/atoms';
import { usePlatformTrades } from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import { usePriceChange } from '@Views/TradePage/Hooks/usePriceChange';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import { OngoingTradesTable } from './OngoingTradesTable';
import { HistoryTable } from './HistoryTable';
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
  const chage = usePriceChange();
  const [historyTrades] = useHistoryTrades();
  const [activeTrades, limitOrders] = useOngoingTrades();
  const [platformActiveTrades, platformHistoryTrades] = usePlatformTrades();
  console.log(`index-chage: `, chage);
  const [activeTable, setActiveTable] = useState('Trades');
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
              className={`text-${s == activeTable ? '1' : '2'} text-f14 ${
                gap.filter((i) => i == s).length
                  ? ' pr-[10px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              <div className="flex items-center gap-x-2">
                {s}
                {s == 'Trades' && activeTrades.length ? (
                  <div className="text-[#C3C2D4] bg-[#171722] text-f10 h-[16px] p-2 pt-[0px] pb-[">
                    <span>{activeTrades.length}</span>
                  </div>
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
          <OngoingTradesTable trades={platformActiveTrades} platform />
        ) : activeTable == 'Platform History' ? (
          <HistoryTable trades={platformHistoryTrades} platform />
        ) : (
          <HistoryTable trades={historyTrades} />
        )}
      </div>
    </div>
  );
};

export { AccordionTable };
