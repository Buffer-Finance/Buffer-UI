import DDArrow from '@SVG/Elements/Arrow';
import { useOngoingTrades } from '@Views/TradePage/Hooks/ongoingTrades';
import { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import OngoingTradesTable from './OngoingTradesTable';
import LimitOrderTable from './LimitOrderTable';
import { useAtom } from 'jotai';
import { isTableShownAtom } from '@Views/TradePage/atoms';
const tables = {
  Trades: OngoingTradesTable,
  'Limit Orders': LimitOrderTable,
  History: OngoingTradesTable,
  'Platform Trades': OngoingTradesTable,
  'Platform History': OngoingTradesTable,
};
const gap = ['History'];

const AccordionTable: React.FC<any> = ({}) => {
  const [expanded, setExpanded] = useAtom(isTableShownAtom);
  const [activeTable, setActiveTable] = useState('Trades');
  const TableComponent = (tables as any)[activeTable];
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
          expanded ? 'h-[500px]' : 'h-[0px]'
        } transition-all  mx-3`}
      >
        <TableComponent />
      </div>
    </div>
  );
};

export { AccordionTable };
