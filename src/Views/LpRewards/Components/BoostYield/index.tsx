import { useLockTxns } from '@Views/LpRewards/Hooks/useLockTxns';
import { usePendingRewards } from '@Views/LpRewards/Hooks/usePendingRewards';
import { poolsType } from '@Views/LpRewards/types';
import { Chain } from 'wagmi';
import { Data } from './Data';
import { HowItWorks } from './HowItWorks';
import { Lock } from './Lock';
import { Transactions } from './Transactions';

export const BoostYield: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activePool, activeChain }) => {
  const { data, error } = useLockTxns(activeChain, activePool);
  const { data: pendingRewards, error: pendingRewardsError } =
    usePendingRewards(activeChain, data);

  if (data === undefined || (!data && !error)) return <div>Loading...</div>;

  return (
    <div className="mt-[64px] w-full">
      <div className="text-#FFFFFF text-f20 font-medium leading-[18px] pb-[20px]">
        Boost Yield
      </div>
      <div className="flex items-stretch gap-3 w-full">
        <Data
          activeChain={activeChain}
          activePool={activePool}
          lockTxns={data}
          pendingRewards={pendingRewards}
        />
        <Lock activeChain={activeChain} activePool={activePool} />
        <HowItWorks />
      </div>
      <Transactions
        activePool={activePool}
        activeChain={activeChain}
        data={data}
        error={error}
        pendingRewards={pendingRewards}
        pendingRewardsError={pendingRewardsError}
      />
    </div>
  );
};
