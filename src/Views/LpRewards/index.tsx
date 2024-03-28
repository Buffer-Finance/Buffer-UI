import { useState } from 'react';
import { Deposit } from './Components/Deposit';
import { PoolData } from './Components/PoolData';
import { PoolTabs } from './Components/PoolTabs';
import { Transactions } from './Components/Transactions';
import { poolsType } from './types';

export const LpRewards = () => {
  const [activePool, setActivePool] = useState<poolsType>('uBLP');

  return (
    <div className="p-8 w-full">
      <PoolTabs activePool={activePool} setActivePool={setActivePool} />
      <PoolData activePool={activePool} />
      <Deposit activePool={activePool} />
      <Transactions activePool={activePool} />
    </div>
  );
};
