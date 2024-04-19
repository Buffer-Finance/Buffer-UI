import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { divide, gt, lte, multiply } from '@Utils/NumString/stringArithmatics';
import { BlueBtn } from '@Views/Common/V2-Button';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { RowBetween } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { CheckCircleOutline, CloseOutlined } from '@mui/icons-material';
import { CircularProgress, Dialog } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { erc20ABI } from 'wagmi';
import NftLockPoolABI from '../../abis/NftLockPool.json';
import RewardRouterABI from '../../abis/RewardRouter.json';
import { AprDD } from '../AprDD';
import { BLPprice } from '../BlpPrice';
import { convertLockPeriodToSeconds } from '../BoostYield/Lock';

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
  max: string;
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
  max,
}) => {
  const [lockPeriod, setLockPeriod] = useState<{
    days: number;
    months: number;
  }>({
    days: 1,
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
        <div className="flex w-full mt-4">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="bg-[#171722] flex flex-col items-center justify-center">
            <button
              className="bg-[#303044] text-1 text-[12px] px-3 rounded-sm h-fit"
              onClick={() => {
                if (balance !== undefined)
                  setAmount(divide(balance, decimals) as string);
              }}
            >
              Max
            </button>
          </div>
          <div className="bg-[#171722] text-[#FFFFFF] rounded-r-[5px] pr-5 pl-3 text-f14 text-center leading-[16px] flex flex-col items-center justify-center">
            {unit}
          </div>
        </div>
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
          lockPeriod={lockPeriod}
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
  lockPeriod: {
    days: number;
    months: number;
  };
}> = ({
  activePool,
  allowance,
  amount,
  activeChain,
  decimals,
  balance,
  lockPeriod,
}) => {
  if (gt(amount || '0', allowance)) {
    return <ApproveButton activePool={activePool} activeChain={activeChain} />;
  }
  return (
    <DepositAndLockButton
      amount={amount}
      activeChain={activeChain}
      decimals={decimals}
      balance={balance}
      lockPeriod={convertLockPeriodToSeconds(lockPeriod)}
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
  lockPeriod: number;
}> = ({ amount, activeChain, decimals, balance, lockPeriod }) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.RewardRouter, RewardRouterABI);
  const { writeCall: lockWriteCall } = useWriteCall(
    contracts.nftLockPool,
    NftLockPoolABI
  );

  const [txnState, setTxnState] = useState<'deposit' | 'lock' | 'none'>('none');
  const [completedTxn, setCompletedTxn] = useState<'deposit' | 'lock' | 'none'>(
    'none'
  );
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
      if (lte(amount, '0')) {
        throw new Error('Amount should be greater than 0');
      }
      await writeCall(
        (returnObj) => {
          if (returnObj !== undefined) {
            setCompletedTxn('deposit');
            setTxnState('lock');
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

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await lockWriteCall(
        (returnObj) => {
          if (returnObj !== undefined) {
            setCompletedTxn('lock');
            toastify({
              type: 'success',
              msg: 'Lock successful',
              id: 'lock-success',
            });
          }
        },
        'createPosition',
        [toFixed(multiply(amount, decimals), 0), lockPeriod]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'handle-deposit-and-lock',
      });
    } finally {
      setTxnState('none');
      setCompletedTxn('none');
    }
  };
  if (txnState !== 'none') {
    return (
      <div className="flex flex-col items-start gap-3 mt-5">
        <TxnState
          isActive={txnState === 'deposit'}
          isComplete={completedTxn === 'deposit' || completedTxn === 'lock'}
          name="deposit"
        />
        <TxnState
          isActive={txnState === 'lock'}
          isComplete={completedTxn === 'lock'}
          name="lock"
        />
      </div>
    );
  }
  return (
    <ModalButton onClick={handleDepositAndLock}>Deposit & Lock</ModalButton>
  );
};

const TxnState: React.FC<{
  isActive: boolean;
  isComplete: boolean;
  name: 'deposit' | 'lock';
}> = ({ name, isActive, isComplete }) => {
  const imageName = name === 'deposit' ? 'Harvest' : 'Lock';
  return (
    <div className="flex gap-3 items-center text-1 text-f16 font-medium w-full capitalize">
      <img
        src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/${imageName}.png`}
        className="w-fit h-fit"
      />
      {name}
      {isActive && (
        <CircularProgress className="!w-[18px] !h-[18px]" color="inherit" />
      )}
      {isComplete && (
        <CheckCircleOutline className="!w-[18px] !h-[18px]" color="success" />
      )}
    </div>
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
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  line-height: 15px;
  color: #c3c2d4;
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
