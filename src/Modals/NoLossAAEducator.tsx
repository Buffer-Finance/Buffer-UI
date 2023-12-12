import { useEffect, useState } from 'react';
import { ModalBase } from './BaseModal';
import { CircularProgress } from '@mui/material';
import { GreenTickMark } from '@Views/OneCT/GreenTickMark';
import { atom, useAtom, useAtomValue } from 'jotai';
type NoLossOnboardState = 'waiting' | 'done' | 'running';

const noLossOnboarderModalAtom = atom<
  | {
      open: true;
      state: 'awaiting_confirmation';
    }
  | {
      open: true;
      state: 'awaiting_txn';
    }
  | {
      open: true;
      state: 'all_done';
    }
  | { open: false }
>({ open: false });

export const useNoLossTxnOnboardModal = () => {
  const [onBoardState, setOnboardState] = useAtom(noLossOnboarderModalAtom);
  const openModal = () => {
    setOnboardState({ open: true, state: 'awaiting_confirmation' });
  };
  const updateModal = () => {
    setOnboardState({ open: true, state: 'awaiting_txn' });
  };
  const successModal = () => {
    setOnboardState({ open: true, state: 'all_done' });
  };
  const closeModal = () => {
    setOnboardState({ open: false });
  };
  return { onBoardState, closeModal, openModal, updateModal, successModal };
};

const NoLossAAEducator: React.FC<any> = ({}) => {
  const { onBoardState, closeModal } = useNoLossTxnOnboardModal();
  useEffect(() => {
    if (onBoardState.state == 'all_done') setTimeout(closeModal, 2000);
  }, [onBoardState.state]);
  return (
    <ModalBase
      open={onBoardState.open}
      onClose={closeModal}
      className="!bg-[#0d1017] !text-[500] !w-[380px] !p-7"
    >
      <div>
        <h1 className="text-f18">Sign Transaction</h1>
        <div className="text-f14 text-2 my-2">
          Please check your wallet and sign the message which will{' '}
          <b>automatically</b>
        </div>
        <ol className="flex-col flex gap-3 my-4">
          <ModalStep
            state={
              onBoardState?.state == 'awaiting_confirmation'
                ? 'running'
                : 'done'
            }
            label="Create signature"
            desc="You have to create a desc"
          />
          <ModalStep
            state={
              onBoardState?.state == 'awaiting_txn'
                ? 'running'
                : onBoardState?.state == 'all_done'
                ? 'done'
                : 'waiting'
            }
            label="Buy Trade"
            desc="You have to create a desc"
          />
        </ol>
        <div className="text-f14 text-2">
          You don't have to sign again. Its one time only
        </div>
      </div>
    </ModalBase>
  );
};

export { NoLossAAEducator };

const ModalStep: React.FC<{
  state: NoLossOnboardState;
  label: string;
  desc: string;
}> = ({ state, label, desc }) => {
  return (
    <li className="flex items-center gap-4 text-1 text-f14">
      <div className="rounded-full bg-[#2c3039] grid place-items-center p-4 ">
        {state == 'running' ? (
          <CircularProgress className="!text-blue  " thickness={5} size={20} />
        ) : state == 'waiting' ? (
          <CircularProgress
            variant="determinate"
            className="!text-2 "
            thickness={5}
            size={20}
            value={100}
          />
        ) : (
          <GreenTickMark />
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-f16 text-1">{label}</div>
        <div className="text-f14 text-2">{desc}</div>
      </div>
    </li>
  );
};
