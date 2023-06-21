import { ExpandSVG } from '@Views/TradePage/Components/Expand';
import { useState } from 'react';
import { TradeCard } from './Trade';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useSetAtom } from 'jotai';
import { isTableShownAtom } from '@Views/TradePage/atoms';
import { NoTrades } from './NoTrades';
import styled from '@emotion/styled';

const tableTypes = ['Trades', 'Limit Orders'];

export const ActiveTrades: React.FC = () => {
  const [tableType, setTableType] = useState(tableTypes[0]);
  const [activeTrades, limitOrderTrades] = useOngoingTrades();
  const setIsTableShown = useSetAtom(isTableShownAtom);
  const isLimitOrderTable = tableType == 'Limit Orders';
  const trades = !isLimitOrderTable ? activeTrades : limitOrderTrades;
  return (
    <>
      <div className="w-full bg-[#282b39] flex justify-evenly text-f14 rounded-t-[8px] py-[8px]  mt-3">
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
      {trades && trades.length === 0 ? (
        <NoTrades isLimitOrderTable={isLimitOrderTable} />
      ) : (
        <TradesBackground>
          {/* <div className="w-full h-[900px] bg-red"></div> */}
          {trades.map((t) => (
            <TradeCard trade={t} key={t.id} />
          ))}
        </TradesBackground>
      )}
    </>
  );
};

const TradesBackground = styled.div`
  flex-grow: 1;
  /* padding: 20px; */
  /* background: blue; */
  flex-basis: 0;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 2px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 24px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
  }
`;
