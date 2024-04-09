import { poolsType, transactionTabType } from '@Views/LpRewards/types';
import { useState } from 'react';
import { Chain } from 'viem';
import { Table } from './Table';
import { Tabs } from './Tabs';

export const Transactions: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activePool, activeChain }) => {
  const [activeTab, setActiveTab] = useState<transactionTabType>('all');
  return (
    <div className="w-full">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Table
        activeTab={activeTab}
        activePool={activePool}
        activeChain={activeChain}
      />
    </div>
  );
};
