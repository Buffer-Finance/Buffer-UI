import { ExpandSVG } from '@Views/TradePage/Components/Expand';
import { useState } from 'react';

const tableTypes = ['Trades', 'Limit Orders'];

export const ActiveTrades: React.FC = () => {
  const [tableType, setTableType] = useState(tableTypes[0]);

  return (
    <div className="sticky top-[0px] z-40 w-full bg-1 flex justify-evenly text-f14 rounded-t-[8px] py-[8px]  ">
      {tableTypes.map((s) => {
        return (
          <div
            className={' cursor-pointer ' + (tableType == s ? 'text-1' : '')}
            onClick={() => setTableType(s)}
          >
            {s}
          </div>
        );
      })}
      <button
        className="bg-primary w-[22px] h-[22px] rounded-[6px] grid  place-items-center hover:text-1 active:text-3"
        onClick={() => {
          // setWideTable(true);
        }}
      >
        <ExpandSVG />
      </button>
    </div>
  );
};
