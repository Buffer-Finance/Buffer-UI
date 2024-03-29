import { ExpandSVG } from '@Views/TradePage/Components/Expand';
import { useState } from 'react';
import { TradeCard } from './Trade';
import { useAtomValue, useSetAtom } from 'jotai';
import { isTableShownAtom } from '@Views/TradePage/atoms';
import { NoTrades } from './NoTrades';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';

import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { usePlatformActiveTrades } from '@Views/ABTradePage/Hooks/useOngoingPlatformTrades';
import { useOngoingTrades as useOngoingTradesAB } from '@Views/ABTradePage/Hooks/useOngoingTrades';

export const ActiveTrades: React.FC<{ isMobile?: boolean; sm?: boolean }> = ({
  isMobile,
  sm,
}) => {
  const tableTypes = sm
    ? ['Trades', 'Limit Orders']
    : ['Up/Down', 'Above/Below', 'Limit Orders'];
  const [tableType, setTableType] = useState(tableTypes[0]);
  const [activeTrades, limitOrderTrades] = useOngoingTrades();
  const setIsTableShown = useSetAtom(isTableShownAtom);
  const isTableShown = useAtomValue(isTableShownAtom);
  const isLimitOrderTable = tableType == 'Limit Orders';
  const isABTable = tableType == 'Above/Below';
  const navigate = useNavigate();
  const { closeShutter } = useShutterHandlers();
  const activeTradesAB = useOngoingTradesAB();
  const trades = !isLimitOrderTable
    ? isABTable
      ? activeTradesAB
      : activeTrades
    : limitOrderTrades;
  // const trades = ongoingTrades;
  console.log(`index-trades: `, trades);
  if (!trades) return <div>Loading...</div>;
  return (
    <>
      <div className="w-full b1200:sticky b1200:top-[0px] b1200:z-50 bg-[#282b39] flex justify-evenly text-f14 rounded-t-[8px] py-[8px]  mt-3">
        {tableTypes.map((s) => {
          return (
            <div
              key={s}
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
          className={`bg-primary w-[22px] h-[22px] rounded-[6px] grid  place-items-center ${
            isTableShown ? 'cursor-not-allowed' : 'hover:text-1'
          }  transition-colors text-3`}
          onClick={() => {
            if (isMobile) {
              closeShutter();
              navigate('/history');
            }
            setIsTableShown(true);
          }}
        >
          <ExpandSVG />
        </button>
      </div>
      {trades && trades.length === 0 ? (
        <NoTrades isLimitOrderTable={isLimitOrderTable} />
      ) : (
        <TradesBackground className="b1200:mb-4">
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
