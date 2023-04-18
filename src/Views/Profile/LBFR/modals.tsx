import { useAtom, useAtomValue } from 'jotai';
import { LBFRModalAtom, LBFRModalNumberAtom } from './atom';
import { Modals } from '@Views/Common/Modals';
import { StakeModal } from '@Views/Common/Modals/StakeModal';
import { UnstakeModal } from '@Views/Common/Modals/UnstakeModal';

export const LBFRmodals = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(LBFRModalAtom);
  const activeModalNumberFrom0 = useAtomValue(LBFRModalNumberAtom);

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <Modals
      isModalOpen={isModalOpen}
      closeModalFunction={closeModal}
      activeModalNumberFrom0={activeModalNumberFrom0}
      modalsArray={[<LBFRstakeModal />, <LBFRunstakeModal />]}
    />
  );
};

const LBFRstakeModal = () => {
  function approve(): () => void {
    return () => {
      console.log('approve');
    };
  }

  function stake(): () => void {
    return () => {
      console.log('stake');
    };
  }
  return (
    <StakeModal
      head="Stake LBFR"
      max="10"
      unit="LBFR"
      approveFunction={approve}
      stakeFunction={stake}
      isApproveLoading={false}
      isApproved={false}
    />
  );
};

const LBFRunstakeModal = () => {
  function unstake(): () => void {
    return () => {
      console.log('unstake');
    };
  }

  return (
    <UnstakeModal
      head="Unstake LBFR"
      max="10"
      unit="LBFR"
      unstakeFunction={unstake}
    />
  );
};
