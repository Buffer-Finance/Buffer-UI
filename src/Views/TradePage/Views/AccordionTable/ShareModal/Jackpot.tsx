import { Dialog } from '@mui/material';
import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { SetShareBetAtom, ShareStateAtom } from '@Views/TradePage/atoms';
import { ModalChild } from './ShareModalChild';
import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import { useMedia, useWindowSize } from 'react-use';
import { JackpotBody } from './JackpotBody';
import Confetti from 'react-confetti';

interface IJackpotModal {}

export const JackpotModal: React.FC<IJackpotModal> = () => {
  const { width, height } = useWindowSize();
  console.log(`Jackpot-width, height: `, width, height);

  return (
    <Dialog open={true} onClose={console.log}>
      <div
        className="w-[100vw] h-[100vh] grid place-items-center"
        onClick={(e) => {
          alert('Modal CLosed');
        }}
      >
        <ShareModalStyles>
          <div className="flex justify-between items-center mb-4 shareModal:mb-3 shareModal:pl-5 shareModal:pr-3">
            <div className="text-f20 text-1 pb-2">Share Position</div>
            <button
              className="p-3 text-1 rounded-full bg-2"
              onClick={console.log}
            >
              <CloseOutlined />
            </button>
          </div>
          <JackpotBody />
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
    padding: 10px 0px;
  }
`;
