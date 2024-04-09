import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { gt, multiply } from '@Utils/NumString/stringArithmatics';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useBlpRate } from '@Views/LpRewards/Hooks/useBlpRate';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { CloseOutlined, KeyboardArrowDown } from '@mui/icons-material';
import { Dialog, Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { erc20ABI } from 'wagmi';
import RewardRouterABI from '../../abis/RewardRouter.json';
import { DayMonthInput } from '../DayMonthInput';

export const Modal: React.FC<{
  isOpen: boolean;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  activePool: poolsType;
  balance: string;
  allowance: string;
  decimals: number;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  activeChain: Chain;
  unit: string;
}> = ({
  closeModal,
  isOpen,
  activePool,
  allowance,
  amount,
  balance,
  decimals,
  setAmount,
  activeChain,
  unit,
}) => {
  const [lockPeriod, setLockPeriod] = useState<{
    days: number;
    months: number;
  }>({
    days: 0,
    months: 0,
  });
  const [isAPRddOpen, setIsAPRddOpen] = useState<boolean>(false);
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
        <RowBetween className="mt-6">
          <div>
            <div className="text-[#808191] text-f16 font-medium leading-[15px]">
              Lock Duration
            </div>
            <button
              onClick={() => {}}
              className="bg-[#141823] text-[#FFFFFF] text-[10px] leading-[12px] font-medium py-[3px] px-[5px] rounded-sm mt-2"
            >
              Max Lock
            </button>
          </div>
          <ColumnGap gap="8px">
            <DayMonthInput data={lockPeriod} setData={setLockPeriod} />
            <div className="text-f12 font-medium text-[#7F87A7] leading-[16px]">
              5.46% Lock Bonus (x1.06)
            </div>
          </ColumnGap>
        </RowBetween>

        <RowBetween className="mt-7">
          <RowGap gap="6px">
            <APRheading>Total APR</APRheading>
            <KeyboardArrowDown
              className={`text-[#ffffff] bg-[#464660] cursor-pointer transition-all duration-500 ease-in-out rounded-sm ${
                !isAPRddOpen ? 'rotate-180' : ''
              }`}
              onClick={() => setIsAPRddOpen(!isAPRddOpen)}
            />
          </RowGap>
          <APRvalue>19.49%</APRvalue>
        </RowBetween>
        {isAPRddOpen && (
          <RowBetween className="mt-5">
            <APRheading>USDC APR</APRheading>
            <APRvalue>15.49%</APRvalue>
          </RowBetween>
        )}
        {isAPRddOpen && (
          <RowBetween className="mt-4">
            <APRheading>Lock Bonus APR</APRheading>
            <APRvalue>4.00%</APRvalue>
          </RowBetween>
        )}
        <ActionButton
          activePool={activePool}
          allowance={allowance}
          amount={amount}
          activeChain={activeChain}
        />
      </ModalStyles>
    </Dialog>
  );
};

const APRheading = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #7f87a7;
`;

const APRvalue = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
`;

const BLPprice: React.FC<{ activeChain: Chain; activePool: poolsType }> = ({
  activeChain,
  activePool,
}) => {
  const { data: blpPrice, error: blpPriceError } = useBlpRate(
    activeChain,
    activePool
  );
  if (blpPrice === undefined && blpPriceError === undefined) {
    return (
      <Skeleton className="w-[50px] !h-5 lc inline" variant="rectangular" />
    );
  } else if (blpPriceError) {
    return <span>0.00 </span>;
  } else if (blpPrice !== undefined) {
    return <span>{blpPrice.price}</span>;
  } else {
    return <span>0.00 </span>;
  }
};

const ActionButton: React.FC<{
  activePool: poolsType;
  allowance: string;
  amount: string;
  activeChain: Chain;
}> = ({ activePool, allowance, amount, activeChain }) => {
  if (gt(amount, allowance)) {
    return <ApproveButton activePool={activePool} activeChain={activeChain} />;
  }
  return <DepositAndLockButton amount={amount} activeChain={activeChain} />;
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
}> = ({ amount, activeChain }) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.RewardRouter, RewardRouterABI);
  const [txnState, setTxnState] = useState<'deposit' | 'lock' | 'none'>('none');
  const toastify = useToast();

  const handleDepositAndLock = async () => {
    try {
      if (amount === '') {
        throw new Error('Please enter an amount');
      }
      if (Number(amount) <= 0) {
        throw new Error('Amount should be greater than 0');
      }
      writeCall(() => {}, 'mintAndStakeBlp', [
        toFixed(multiply(amount, 6), 0),
        0,
      ]);
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
    <ModalButton disabled={gt(amount, '0')} onClick={handleDepositAndLock}>
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
`;

const ModalButton = styled(BlueBtn)`
  width: fit-content;
  height: fit-content;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  padding: 1px 8px;
  margin-top: 16px;
`;
