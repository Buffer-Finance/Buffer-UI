import { useToast } from '@Contexts/Toast';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { poolsType } from '@Views/LpRewards/types';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Chain } from 'viem';
import { InputField } from './InputField';
import { Modal } from './Modal';

export const DepositTab: React.FC<{
  activePool: poolsType;
  readcallData: { [callId: string]: string[] };
  activeChain: Chain;
}> = ({ activePool, readcallData, activeChain }) => {
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
  return (
    <div>
      <Modal
        activeChain={activeChain}
        isOpen={isModalOpen}
        closeModal={setIsModalOpen}
        activePool={activePool}
        balance={balance}
        allowance={allowance}
        decimals={decimals}
        amount={amount}
        setAmount={setAmount}
        unit={uint}
      />
      <InputField
        activePool={activePool}
        setValue={setAmount}
        balance={'40000000000'}
        unit={uint}
        decimals={activePool === 'aBLP' ? 18 : 6}
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
        As a counterparty in trades, you will receive 50% of trading fees, which
        are automatically compounded into your uBLP holdings.
      </Text>
      <Text>
        * uBLP is NOT principal protected. The value of uBLP may decrease from
        traders' PnL.
      </Text>
      <Text>
        * 0.1% fee is incurred when withdrawing from Merkle LP. The fee is
        credited to the remaining LPs to reward long-term depositors.
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
