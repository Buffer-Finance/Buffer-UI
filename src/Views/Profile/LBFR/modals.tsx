import { useAtom, useAtomValue } from 'jotai';
import { LBFRModalAtom, LBFRModalNumberAtom } from './atom';
import { Modals } from '@Views/Common/Modals';
import { StakeModal } from '@Views/Common/Modals/StakeModal';
import { UnstakeModal } from '@Views/Common/Modals/UnstakeModal';
import { useGetApprovalAmount } from '@Views/Earn/Hooks/useEarnWriteCalls';
import { useActiveChain } from '@Hooks/useActiveChain';
import { erc20ABI } from 'wagmi';
import { getContract } from './Config/Addresses';
import { useState } from 'react';
import { useLBFRreadCalls } from './Hooks/useReadCalls';
import { toFixed } from '@Utils/NumString';
import {
  divide,
  getPosInf,
  gt,
  multiply,
} from '@Utils/NumString/stringArithmatics';
import { useWriteCall } from '@Hooks/useWriteCall';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import useWriteCallValidations from '@Hooks/Utilities/useWriteCallValidations';
import { useToast } from '@Contexts/Toast';
import { SomethingWentWrongModal } from '@Views/Common/Modals/SomethingWentWrong';

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
      modalsArray={[
        <LBFRstakeModal closeModalFn={closeModal} />,
        <LBFRunstakeModal closeModalFn={closeModal} />,
      ]}
    />
  );
};

const LBFRstakeModal = ({ closeModalFn }: { closeModalFn: () => void }) => {
  const toastify = useToast();
  try {
    const { activeChain } = useActiveChain();
    const readcallData = useLBFRreadCalls();
    const [approveState, setApprovalState] = useState(false);
    const { approve } = useGetApprovalAmount(
      erc20ABI,
      getContract(activeChain.id, 'LBFR'),
      getContract(activeChain.id, 'LBFRrewardTracker')
    );
    const { writeCall } = useWriteCall(
      getContract(activeChain.id, 'LBFRrewardTracker'),
      RewardTrackerAbi
    );
    const { amountValidations, exitValidations, userBalanceValidations } =
      useWriteCallValidations();
    const userBalance = divide(
      readcallData?.userBalance ?? '0',
      readcallData?.decimals ?? '0'
    ) as string;

    function approveFunction(): void {
      approve(toFixed(getPosInf(), 0), setApprovalState);
    }

    function stake(amount: string): void {
      if (
        amountValidations(amount) ||
        exitValidations() ||
        userBalanceValidations(amount, userBalance)
      )
        return;
      writeCall(closeModalFn, 'stake', [
        getContract(activeChain.id, 'LBFR'),
        toFixed(multiply(amount, readcallData?.decimals ?? '0'), 0),
      ]);
    }
    return (
      <StakeModal
        head="Stake LBFR"
        max={userBalance}
        unit="LBFR"
        approveFunction={approveFunction}
        stakeFunction={stake}
        isApproveLoading={approveState}
        allowance={readcallData?.allowance ?? '0'}
      />
    );
  } catch (e) {
    toastify({
      type: 'error',
      msg: (e as Error).message + ' on LBFR stake modal component',
      id: 'LBFRstakeModal',
    });
    return <SomethingWentWrongModal />;
  }
};

const LBFRunstakeModal = ({ closeModalFn }: { closeModalFn: () => void }) => {
  const toastify = useToast();
  try {
    const { activeChain } = useActiveChain();
    const readcallData = useLBFRreadCalls();
    const { writeCall } = useWriteCall(
      getContract(activeChain.id, 'LBFRrewardTracker'),
      RewardTrackerAbi
    );
    const { amountValidations, exitValidations } = useWriteCallValidations();
    const userStaked = divide(
      readcallData?.userStaked ?? '0',
      readcallData?.decimals ?? '0'
    ) as string;

    function unstake(amount: string): void {
      if (amountValidations(amount) || exitValidations()) return;
      if (gt(amount, userStaked))
        return toastify({
          type: 'error',
          msg: "Can't unstake more than staked",
          id: 'LBFRunstake',
        });
      writeCall(() => {}, 'unstake', [
        getContract(activeChain.id, 'LBFR'),
        toFixed(multiply(amount, readcallData?.decimals ?? '0'), 0),
      ]);
    }

    return (
      <UnstakeModal
        head="Unstake LBFR"
        max={userStaked}
        unit="LBFR"
        unstakeFunction={unstake}
      />
    );
  } catch (e) {
    toastify({
      type: 'error',
      msg: (e as Error).message + ' on LBFR unstake modal component',
      id: 'LBFRstakeModal',
    });
    return <SomethingWentWrongModal />;
  }
};
