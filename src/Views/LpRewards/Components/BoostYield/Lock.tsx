import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import {
  add,
  divide,
  gt,
  lte,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { RowBetween } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Chain } from 'viem';
import NftLockPoolABI from '../../abis/NftLockPool.json';
import { AprDD } from '../AprDD';
import { BLPprice } from '../BlpPrice';
import { ModalButton } from '../Deposit/Modal';
import { Container } from '../Deposit/Styles';
import { convertToNumberOfMonthsAndDays } from './Transactions/helpers';
import { useAtom } from 'jotai';
import { lockErrorAtom } from '../DayMonthInput';

const Input = styled.input`
  background-color: #232334;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  line-height: 13px;
  color: #ffffff;
  width: 100%;
  outline: none;
`;

export function convertLockPeriodToSeconds({
  days,
  months,
}: {
  days: number;
  months: number;
}) {
  return days * 24 * 60 * 60 + months * 30 * 24 * 60 * 60;
}

export const Lock: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
  readcallData: { [callId: string]: string[] };
  totalLocked: string;
  totalUnlocked: string;
  minLockDuration: number;
  maxLockDuration: number;
}> = ({
  activeChain,
  activePool,
  readcallData,
  totalLocked,
  totalUnlocked,
  minLockDuration,
  maxLockDuration,
}) => {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(
    convertToNumberOfMonthsAndDays(minLockDuration)
  );
  const decimals = activePool === 'aBLP' ? 18 : 6;
  const balance = readcallData[activePool + '-depositBalances']?.[0];

  const alreadyLocked = add(totalLocked, totalUnlocked);
  let max = '0';
  if (balance) {
    max = divide(subtract(balance, alreadyLocked), decimals) as string;
  }
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  return (
    <Container className="min-w-[350px]">
      <div className="w-full">
        <RowBetween>
          <span className="text-f15 text-[#C3C2D4] font-medium">
            Lock Amount
          </span>
        </RowBetween>
        <div className="flex w-full mt-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="bg-[#232334] flex flex-col items-center justify-center">
            <button
              className="bg-[#141823] text-1 text-[9px] px-3 rounded-sm h-fit"
              onClick={() => {
                setAmount(max);
              }}
            >
              Max
            </button>
          </div>
          <div className="bg-[#232334] text-[#FFFFFF] rounded-r-[5px] pr-5 pl-3 py-3 text-f14 leading-[16px]">
            {unit}
          </div>
        </div>
        <div className="text-f12 font-medium leading-[16px] text-[#7F87A7] mt-3">
          1.00&nbsp;uBLP&nbsp;=&nbsp;
          <BLPprice activeChain={activeChain} activePool={activePool} />
          {unit}
        </div>
        <AprDD
          lockPeriod={lockPeriod}
          setLockPeriod={setLockPeriod}
          activeChain={activeChain}
          activePool={activePool}
          minLockDuration={minLockDuration}
          maxLockDuration={maxLockDuration}
        />
        <LockButton
          activePool={activePool}
          activeChain={activeChain}
          amount={amount}
          decimals={decimals}
          lockPeriod={convertLockPeriodToSeconds(lockPeriod)}
          max={max}
        />
      </div>
    </Container>
  );
};

const LockButton: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  amount: string;
  decimals: number;
  lockPeriod: number;
  max: string;
}> = ({ activePool, activeChain, amount, decimals, lockPeriod, max }) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NftLockPoolABI);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const toastify = useToast();
  const [lock, setLock] = useAtom(lockErrorAtom);
  const handleApprove = async () => {
    if (lock != '') return toastify({ type: 'error', msg: lock });
    try {
      //check if amount contains any characters
      // if (amount.match(/[a-zA-Z]/g))
      //   throw new Error('Please enter valid amount');

      // //check if amount contains any special characters other than .
      // if (amount.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/))
      //   throw new Error('Please enter valid amount');

      if (!amount) throw new Error('Please enter amount');

      if (amount === '') throw new Error('Please enter amount');

      if (lte(amount, '0')) throw new Error('Amount should be greater than 0');

      if (gt(amount, max)) throw new Error('Amount should be less than max');

      //check if lock duration is 0
      if (lockPeriod === 0) throw new Error('Please select lock period');

      setIsApproving(true);
      const lockamount = toFixed(multiply(amount, decimals) as string, 0);
      await writeCall(() => {}, 'createPosition', [lockamount, lockPeriod]);
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'handle-lock',
      });
      console.error(e);
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
      Lock
    </ModalButton>
  );
};
