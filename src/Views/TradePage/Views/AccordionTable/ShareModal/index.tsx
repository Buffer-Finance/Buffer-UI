import { Dialog } from '@mui/material';
import React from 'react';
import { useAtom } from 'jotai';
import { SetShareBetAtom, ShareStateAtom } from '@Views/TradePage/atoms';
import { ModalChild } from './ShareModalChild';

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
      <ModalChild closeModal={closeModal} />
    </Dialog>
  );
};
