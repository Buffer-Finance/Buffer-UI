import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { Chain } from 'viem';
import NftLockPoolABI from '../../abis/NftLockPool.json';
import { BLPprice } from '../BlpPrice';
import { DayMonthInput } from '../DayMonthInput';
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

const APRheading = styled.div`
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  color: #7f87a7;
`;

const APRvalue = styled.div`
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
`;

function convertLockPeriodToSeconds({
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
  const [lockPeriod, setLockPeriod] = useState({ days: 0, months: 0 });
  const [isAPRddOpen, setIsAPRddOpen] = useState(false);
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
        <RowBetween className="mt-6">
          <div>
            <div className="text-[#808191] text-f13 font-medium leading-[15px]">
              Lock Duration
            </div>
            <button
              onClick={() => {}}
              className="bg-[#232334] text-[#FFFFFF] text-[10px] leading-[12px] font-medium py-[3px] px-[5px] rounded-sm mt-2"
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
