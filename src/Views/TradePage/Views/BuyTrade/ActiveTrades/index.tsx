import { ExpandSVG } from '@Views/TradePage/Components/Expand';
import { useState } from 'react';
import { TradeCard } from './Trade';
import { useOngoingTrades } from '@Views/TradePage/Hooks/ongoingTrades';
import { useSetAtom } from 'jotai';
import { isTableShownAtom } from '@Views/TradePage/atoms';

const tableTypes = ['Trades', 'Limit Orders'];

export const ActiveTrades: React.FC = () => {
  const [cancelLoading, setCancelLoading] = useState<null | number>(null);
  const [tableType, setTableType] = useState(tableTypes[0]);
  const [activeTrades, limitOrderTrades] = useOngoingTrades();
  const setIsTableShown = useSetAtom(isTableShownAtom);
  const trades = tableType == 'Trades' ? activeTrades : limitOrderTrades;
  return (
    <>
      <div className="w-full bg-1 flex justify-evenly text-f14 rounded-t-[8px] py-[8px]  mt-3">
        {tableTypes.map((s) => {
          return (
            <div
              className={
                ' cursor-pointer ' + (tableType == s ? 'text-1' : 'text-2')
              }
              onClick={() => setTableType(s)}
            >
              {s}
            </div>
          );
        })}
        <button
          className="bg-primary w-[22px] h-[22px] rounded-[6px] grid  place-items-center hover:text-1 active:text-3"
          onClick={() => {
            setIsTableShown(true);
          }}
        >
          <ExpandSVG />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {trades.map((t) => (
          <TradeCard
            trade={t}
            key={t.id}
            cancelLoading={cancelLoading}
            setCancelLoading={setCancelLoading}
          />
        ))}
      </div>
    </>
  );
};
