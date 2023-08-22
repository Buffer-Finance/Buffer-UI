import { Dialog } from '@mui/material';
import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { SetShareBetAtom, ShareStateAtom } from '@Views/TradePage/atoms';
import { ModalChild } from './ShareModalChild';
import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import ShutterProvider, {
  shutterModalAtom,
  useShutterHandlers,
} from '@Views/Common/MobileShutter/MobileShutter';
import { useMedia } from 'react-use';

interface IShareModal {}

export const ShareModal: React.FC<IShareModal> = () => {
  const [{ isOpen }, setIsOpen] = useAtom(ShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);

  const closeModal = () => {
    setIsOpen({ isOpen: false });
    setBet({ expiryPrice: null, trade: null, poolInfo: null, market: null });
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ShareModalStyles>
        <div className="flex justify-between items-center mb-4 shareModal:mb-3 shareModal:pl-5 shareModal:pr-3">
          <div className="text-f20 text-1 pb-2">Share Position</div>
          <button className="p-3 text-1 rounded-full bg-2" onClick={closeModal}>
            <CloseOutlined />
          </button>
        </div>
        <ModalChild />
      </ShareModalStyles>
    </Dialog>
  );
};

export const ShareModalStyles = styled.div`
  padding: 20px;
  background: #232334;
  border-radius: 12px;

  @media (max-width: 425px) {
    padding: 10px 0px;
  }
`;
