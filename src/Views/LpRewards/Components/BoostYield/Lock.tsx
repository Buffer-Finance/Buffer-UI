import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
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
}> = ({ activeChain, activePool }) => {
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState({ days: 1, months: 0 });
  const decimals = activePool === 'aBLP' ? 18 : 6;

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
          <div className="bg-[#232334] text-[#FFFFFF] rounded-r-[5px] px-5 py-3 text-f14 leading-[16px]">
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
        />
        <LockButton
          activePool={activePool}
          activeChain={activeChain}
          amount={amount}
          decimals={decimals}
          lockPeriod={convertLockPeriodToSeconds(lockPeriod)}
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
}> = ({ activePool, activeChain, amount, decimals, lockPeriod }) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NftLockPoolABI);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const toastify = useToast();

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const lockamount = toFixed(multiply(amount, decimals), 0);
      console.log(lockamount, lockPeriod, 'params');
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
