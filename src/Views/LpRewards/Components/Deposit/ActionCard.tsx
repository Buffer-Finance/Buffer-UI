import { depositTabType, poolsType } from '@Views/LpRewards/types';
import styled from '@emotion/styled';
import { useState } from 'react';
import { Container } from './Styles';

export const ActionCard: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  const [depositTabType, setDepositTabType] =
    useState<depositTabType>('deposit');
  return (
    <Container>
      <Tabs activeTab={depositTabType} setDepositTabType={setDepositTabType} />
    </Container>
  );
};

export const Tabs: React.FC<{
  activeTab: depositTabType;
  setDepositTabType: (newTab: depositTabType) => void;
}> = ({ activeTab, setDepositTabType }) => {
  return (
    <div className="flex items-center gap-7">
      <TabButton
        onClick={() => setDepositTabType('deposit')}
        isActive={activeTab === 'deposit'}
      >
        Deposit
      </TabButton>
      <TabButton
        onClick={() => setDepositTabType('withdraw')}
        isActive={activeTab === 'withdraw'}
      >
        Withdraw
      </TabButton>
      <TabButton
        onClick={() => setDepositTabType('vest')}
        isActive={activeTab === 'vest'}
      >
        Vest
      </TabButton>
    </div>
  );
};

const TabButton = styled.button<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#EFF0F0' : '#d9d9d999')};
  font-size: 16px;
  line-height: 16px;
  font-weight: 500;
`;
