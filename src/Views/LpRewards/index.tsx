import { useActiveChain } from '@Hooks/useActiveChain';
import { useState } from 'react';
import { Chain } from 'wagmi';
import { BoostYield } from './Components/BoostYield';
import { Deposit } from './Components/Deposit';
import { PoolData } from './Components/PoolData';
import { PoolTabs } from './Components/PoolTabs';
import { Transactions } from './Components/Transactions';
import { useLPmulticalldata } from './Hooks/useLPmulticalldata';
import { poolsType } from './types';

export const LpRewards = () => {
  const [activePool, setActivePool] = useState<poolsType>('uBLP');
  const { activeChain } = useActiveChain();
  if (activeChain === undefined) return <div>Loading...</div>;
  return (
    <div className="p-8 w-full">
      <PoolTabs activePool={activePool} setActivePool={setActivePool} />
      <LPRewardsPage activePool={activePool} activeChain={activeChain} />
      <Transactions activePool={activePool} activeChain={activeChain} />
    </div>
  );
};

const LPRewardsPage: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activePool, activeChain }) => {
  const { data, error } = useLPmulticalldata(activeChain, activePool);
  if (error) return <div>Something Went wrong.Please try again.</div>;
  if (!error && !data) return <div>Loading...</div>;
  console.log(data);
  return (
    <>
      <PoolData
        activePool={activePool}
        readCallData={data}
        activeChain={activeChain}
      />
      <Deposit
        activePool={activePool}
        readCallData={data}
        activeChain={activeChain}
      />
      <BoostYield activePool={activePool} activeChain={activeChain} />
    </>
  );
};
