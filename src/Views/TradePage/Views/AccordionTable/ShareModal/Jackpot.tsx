import { Dialog } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { SetShareBetAtom, ShareStateAtom } from '@Views/TradePage/atoms';
import { ModalChild } from './ShareModalChild';
import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import { useMedia, useWindowSize } from 'react-use';
import { JackpotBody } from './JackpotBody';
import Confetti from 'react-confetti';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import { getJackpotKey, useJackpotManager } from 'src/atoms/JackpotState';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';

interface IJackpotModal {}

export const JackpotModal: React.FC<IJackpotModal> = () => {
  const [activeTrades] = useOngoingTrades();
  const { page_data: historyTrades } = useHistoryTrades();
  const { jackpot, jackpotAcknowledged } = useJackpotManager();
  const trade = useMemo(() => {
    const alltrades = [...activeTrades, ...historyTrades];
    const foundTrade = alltrades?.filter((trade) => {
      const tradeKey = getJackpotKey(trade);
      if (tradeKey == jackpot.recent) {
        return true;
      }
      return false;
    });
    if (foundTrade?.length) {
      return {
        ...foundTrade?.[0],
        jackpotAmount: jackpot.jackpots[jackpot.recent].jackpot_amount,
      };
    } else {
      return jackpot.jackpots[jackpot.recent];
    }
  }, [activeTrades, jackpot, historyTrades]);
  const { width, height } = useWindowSize();
  const [confettiDuration, setConfettiDuration] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setConfettiDuration(false);
    }, 15000);
  }, []);
  return (
    <Dialog open={Boolean(jackpot.recent)} onClose={jackpotAcknowledged}>
      <div
        className="w-[100vw] h-[100vh] grid place-items-center"
        onClick={jackpotAcknowledged}
      >
        {confettiDuration ? (
          <Confetti width={width} height={height} numberOfPieces={100} />
        ) : null}
        <ShareModalStyles onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 shareModal:mb-3 shareModal:pl-5 shareModal:pr-3">
            <div className="text-f20 text-1 pb-2">Share Jackpot</div>
            <button
              className="p-3 text-1 rounded-full bg-2 b400:mr-5"
              onClick={jackpotAcknowledged}
            >
              <CloseOutlined />
            </button>
          </div>
          {trade ? <JackpotBody trade={trade} /> : null}
        </ShareModalStyles>
      </div>
    </Dialog>
  );
};

export const ShareModalStyles = styled.div`
  padding: 20px;
  background: #232334;
  border-radius: 12px;
  width: fit-content;
  height: fit-content;

  @media (max-width: 425px) {
    padding: 10px 10px;
  }
`;
