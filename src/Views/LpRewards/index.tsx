import { useActiveChain } from '@Hooks/useActiveChain';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useState } from 'react';
import { Chain } from 'wagmi';
import { BoostYield } from './Components/BoostYield';
import { Deposit } from './Components/Deposit';
import { MobileTabs } from './Components/MobileTabs';
import { PoolData } from './Components/PoolData';
import { Transactions } from './Components/Transactions';
import { MobileTransactions } from './Components/Transactions/MobileTransactions';
import { useLPmulticalldata } from './Hooks/useLPmulticalldata';
import { mobileTabsType, poolsType } from './types';

const LpRewards = () => {
  const [activePool, setActivePool] = useState<poolsType>('uBLP');
  const [activeMobileTab, setActiveMobileTab] =
    useState<mobileTabsType>('deposits');
  const { activeChain } = useActiveChain();
  if (activeChain === undefined) return <div>Loading...</div>;
  return (
    <div className="p-8 w-full sm:p-4">
      {/* <PoolTabs activePool={activePool} setActivePool={setActivePool} /> */}
      <MobileTabs
        activeTab={activeMobileTab}
        setActiveTab={setActiveMobileTab}
      />
      <HorizontalTransition value={activeMobileTab === 'deposits' ? 0 : 1}>
        <>
          <LPRewardsPage activePool={activePool} activeChain={activeChain} />
          <Transactions activePool={activePool} activeChain={activeChain} />
        </>
        <MobileTransactions activePool={activePool} activeChain={activeChain} />
      </HorizontalTransition>
    </div>
  );
};

const LPRewardsPage: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activePool, activeChain }) => {
  const { data, error } = useLPmulticalldata(activeChain, activePool);
  // if (error) return <div>Something Went wrong.Please try again.</div>;
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
      <BoostYield
        activePool={activePool}
        activeChain={activeChain}
        readcallData={data}
      />
    </>
  );
};

export default LpRewards;
