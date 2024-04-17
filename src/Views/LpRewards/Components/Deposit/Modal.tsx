import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { gt, multiply } from '@Utils/NumString/stringArithmatics';
import { BlueBtn } from '@Views/Common/V2-Button';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { RowBetween } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { erc20ABI } from 'wagmi';
import RewardRouterABI from '../../abis/RewardRouter.json';
import { AprDD } from '../AprDD';
import { BLPprice } from '../BlpPrice';

export const Modal: React.FC<{
  isOpen: boolean;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  activePool: poolsType;
  allowance: string;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  activeChain: Chain;
  unit: string;
  decimals: number;
  balance: string | undefined;
}> = ({
  closeModal,
  isOpen,
  activePool,
  allowance,
  amount,
  setAmount,
  activeChain,
  unit,
  decimals,
  balance,
}) => {
  const [lockPeriod, setLockPeriod] = useState<{
    days: number;
    months: number;
  }>({
    days: 0,
    months: 0,
  });
  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ModalStyles>
        <RowBetween>
          <span className="text-f18 text-[#C3C2D4] font-medium">Amount</span>
          <button
            className="p-3 text-1 rounded-full bg-2"
            onClick={() => closeModal(false)}
          >
            <CloseOutlined />
          </button>
        </RowBetween>
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="text-f14 font-medium leading-[16px] text-[#7F87A7] mt-3">
          1.00&nbsp;uBLP&nbsp;=&nbsp;
          <BLPprice activeChain={activeChain} activePool={activePool} />
          {unit}
        </div>
        <AprDD
          lockPeriod={lockPeriod}
          setLockPeriod={setLockPeriod}
          activeChain={activeChain}
          activePool={activePool}
        />
        <ActionButton
          activePool={activePool}
          allowance={allowance}
          amount={amount}
          activeChain={activeChain}
          decimals={decimals}
          balance={balance}
        />
      </ModalStyles>
    </Dialog>
  );
};

const ActionButton: React.FC<{
  activePool: poolsType;
  allowance: string;
  amount: string;
  activeChain: Chain;
  decimals: number;
  balance: string | undefined;
}> = ({ activePool, allowance, amount, activeChain, decimals, balance }) => {
  if (gt(amount || '0', allowance)) {
    return <ApproveButton activePool={activePool} activeChain={activeChain} />;
  }
  return (
    <DepositAndLockButton
      amount={amount}
      activeChain={activeChain}
      decimals={decimals}
      balance={balance}
    />
  );
};

const ApproveButton: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activePool, activeChain }) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.USDC, erc20ABI as any);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const toastify = useToast();

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await writeCall(() => {}, 'approve', [
        contracts.uBLP,
        '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      ]);
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'handle-approve',
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <ModalButton
      onClick={handleApprove}
      isLoading={isApproving}
      isDisabled={isApproving}
    >
      Approve
    </ModalButton>
  );
};

const DepositAndLockButton: React.FC<{
  amount: string;
  activeChain: Chain;
  decimals: number;
  balance: string | undefined;
}> = ({ amount, activeChain, decimals, balance }) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.RewardRouter, RewardRouterABI);
  const [txnState, setTxnState] = useState<'deposit' | 'lock' | 'none'>('none');
  const toastify = useToast();

  const handleDepositAndLock = async () => {
    try {
      setTxnState('deposit');
      if (amount === undefined) {
        throw new Error('Please enter an amount');
      }
      if (amount === '') {
        throw new Error('Please enter an amount');
      }
      if (balance === undefined) {
        throw new Error('Please wait for the data to load');
      }
      if (gt(amount, balance)) {
        throw new Error('Insufficient balance');
      }

      if (Number(amount) <= 0) {
        throw new Error('Amount should be greater than 0');
      }
      writeCall(
        (returnObj) => {
          if (returnObj !== undefined) {
            toastify({
              type: 'success',
              msg: 'Deposit successful',
              id: 'deposit-success',
            });
          }
        },
        'mintAndStakeBlp',
        [toFixed(multiply(amount, decimals), 0), 0]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'handle-deposit-and-lock',
      });
    } finally {
      setTxnState('none');
    }
  };
  if (txnState !== 'none') {
    return <div></div>;
  }
  return (
    <ModalButton
      isDisabled={txnState !== 'none'}
      isLoading={txnState !== 'none'}
      onClick={handleDepositAndLock}
    >
      Deposit & Lock
    </ModalButton>
  );
};

const ModalStyles = styled.div`
  background-color: #232334;
  padding: 24px;
  min-width: 350px;
`;

const Input = styled.input`
  background-color: #171722;
  padding: 8px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  line-height: 15px;
  color: #c3c2d4;
  margin-top: 12px;
  width: 100%;
  outline: none;
`;

export const ModalButton = styled(BlueBtn)`
  width: fit-content;
  height: fit-content;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  padding: 1px 8px;
  margin-top: 16px;
  min-height: 30px;
`;
