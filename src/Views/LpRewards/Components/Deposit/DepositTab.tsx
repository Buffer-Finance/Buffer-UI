import { useToast } from '@Contexts/Toast';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { poolsType } from '@Views/LpRewards/types';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { InputField } from './InputField';
import { Modal } from './Modal';
import { useTokensPerInterval } from '@Views/LpRewards/Hooks/useTokensPerInterval';

export const DepositTab: React.FC<{
  activePool: poolsType;
  readcallData: { [callId: string]: string[] };
  activeChain: Chain;
}> = ({ activePool, readcallData, activeChain }) => {
  const { data, error } = useTokensPerInterval(activeChain);
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toastify = useToast();

  const decimals = activePool === 'aBLP' ? 18 : 6;

  const balance = readcallData[activePool + '-balanceof']?.[0];
  const allowance = readcallData[activePool + '-allowance']?.[0];

  const uint = activePool === 'aBLP' ? 'ARB' : 'USDC';
  const handleDeposit = () => {
    try {
      if (balance === undefined) {
        throw new Error('Balance not found');
      }
      if (allowance === undefined) {
        throw new Error('Allowance not found');
      }
      if (amount === '') {
        throw new Error('Please enter an amount');
      }
      if (gt(amount, divide(balance, decimals) as string)) {
        throw new Error('Insufficient balance');
      }
      setIsModalOpen(true);
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'handle-deposit-tab',
      });
    }
  };
  if (error || !data)
    return <Skeleton variant="rectangular" width="100%" height="100px" />;
  return (
    <div>
      <Modal
        activeChain={activeChain}
        isOpen={isModalOpen}
        closeModal={setIsModalOpen}
        activePool={activePool}
        allowance={allowance}
        amount={amount}
        setAmount={setAmount}
        unit={uint}
        decimals={decimals}
        balance={balance}
        maxLockPeriod={Number(data.lockMultiplierSettings[0].maxLockDuration)}
        minLockPeriod={Number(data.lockMultiplierSettings[0].minLockDuration)}
      />
      <InputField
        activePool={activePool}
        setValue={setAmount}
        balance={balance}
        unit={uint}
        decimals={decimals}
        max={balance}
        value={amount}
      />
      <div className="flex justify-between items-start mt-2">
        <span className="text-f12 font-medium text-[#C4C7C7]">
          You will receive:
        </span>
        <ConnectionRequired className="!text-f14 !py-[0] !px-4 mt-2">
          <BlueBtn
            onClick={handleDeposit}
            className="!text-f14 !h-fit !py-[0] !px-4 leading-[28px] mt-2"
          >
            Deposit
          </BlueBtn>
        </ConnectionRequired>
      </div>
      <Text>
        As a counterparty in trades, you will receive 70% of the trading fees.
        APR is updated every Wednesday at4:00 pm UTC
      </Text>
      <Text>
        * uBLP is NOT principal protected. The value of uBLP may decrease from
        traders' PnL.
      </Text>
    </div>
  );
};

export const Text = styled.p`
  margin-top: 16px;
  font-size: 14px;
  line-height: 16px;
  color: #7f87a7;
  font-weight: 500;
`;
