import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { poolsType } from '@Views/LpRewards/types';
import styled from '@emotion/styled';
import { useState } from 'react';
import { InputField } from './InputField';

export const DepositTab: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  const [amount, setAmount] = useState<string>('');
  return (
    <div>
      <InputField
        activePool={activePool}
        setValue={setAmount}
        balance={'40000000000'}
        unit={activePool === 'aBLP' ? 'ARB' : 'USDC'}
        decimals={activePool === 'aBLP' ? 18 : 6}
      />
      <div className="flex justify-between items-start mt-2">
        <span className="text-f12 font-medium text-[#C4C7C7]">
          You will receive:
        </span>
        <ConnectionRequired className="!text-f14 !py-[0] !px-4 mt-2">
          <BlueBtn
            onClick={() => {}}
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
