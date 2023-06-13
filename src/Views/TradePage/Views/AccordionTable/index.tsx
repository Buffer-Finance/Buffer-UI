import DDArrow from '@SVG/Elements/Arrow';
import { useOngoingTrades } from '@Views/TradePage/Hooks/ongoingTrades';
import { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import OngoingTradesTable from './OngoingTradesTable';
const tables = [
  'Trades',
  'Limit Orders',
  'History',
  'Platform Trades',
  'Platform History',
];
const gap = [2];
const AccordionTable: React.FC<any> = ({}) => {
  const [expanded, setExpanded] = useState(false);
  const trades = useOngoingTrades();
  console.log(`index-trades: `, trades);
  const [activeTable, setActiveTable] = useState('Trades');
  return (
    <div className="flex flex-col ">
      <div className="w-full flex items-center  justify-between p-3">
        <div className="flex gap-x-[15px]">
          {tables.map((s) => (
            <button
              onClick={() => setActiveTable(s)}
              className={`text-${s == activeTable ? '1' : '2'} text-f14 ${
                gap.filter((i) => tables[i] == s).length
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
          Show Position{' '}
          <DDArrow
            className={`transition scale group-hover:scale-150  ${
              expanded ? ' rotate-0' : 'rotate-180'
            }`}
          />
        </button>
      </div>
      <div
        className={` ${
          expanded ? 'h-[400px]' : 'h-[0px]'
        } transition-all  overflow-hidden mx-3`}
      >
        <OngoingTradesTable />
      </div>
    </div>
  );
};

export { AccordionTable };
