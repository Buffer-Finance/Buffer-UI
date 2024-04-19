import { add } from '@Utils/NumString/stringArithmatics';
import { useLockTxns } from '@Views/LpRewards/Hooks/useLockTxns';
import { usePendingRewards } from '@Views/LpRewards/Hooks/usePendingRewards';
import { poolsType } from '@Views/LpRewards/types';
import { useMemo } from 'react';
import { Chain } from 'wagmi';
import { Data } from './Data';
import { HowItWorks } from './HowItWorks';
import { Lock } from './Lock';
import { Transactions } from './Transactions';

export const BoostYield: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  readcallData: { [callId: string]: string[] };
}> = ({ activePool, activeChain, readcallData }) => {
  const { data, error } = useLockTxns(activeChain, activePool);
  const { data: pendingRewards, error: pendingRewardsError } =
    usePendingRewards(activeChain, data?.nftPoolTxns);

  const computedData = useMemo(() => {
    let totalLocked = '0';
    let totalUnlocked = '0';
    let totalClaimable = '0';
    const withdrawableNftIds: string[] = [];
    const claimableIds: string[] = [];

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (data === undefined) {
      return {
        totalLocked,
        totalUnlocked,
        totalClaimable,
        withdrawableNftIds,
        claimableIds,
      };
    }
    console.log(data);

    data.nftPoolTxns.forEach((txn) => {
      if (Number(txn.lockPeriod) + Number(txn.timestamp) > currentTimestamp) {
        totalLocked = add(totalLocked, txn.amount);
      } else {
        totalUnlocked = add(totalUnlocked, txn.amount);
        withdrawableNftIds.push(txn.nftId);
      }

      const unclaimedRewards = pendingRewards?.[txn.nftId]?.[0];

      if (unclaimedRewards) {
        totalClaimable = add(totalClaimable, unclaimedRewards);
        claimableIds.push(txn.nftId);
      }
    });

    return {
      totalLocked,
      totalUnlocked,
      totalClaimable,
      withdrawableNftIds,
      claimableIds,
    };
  }, [data, pendingRewards]);
  if (data === undefined || (!data && !error)) return <div>Loading...</div>;

  return (
    <div className="mt-[64px] w-full sm:mt-[32px]">
      <div className="text-#FFFFFF text-f20 font-medium leading-[18px] pb-[20px]">
        Boost Yield
      </div>
      <div className="flex items-stretch gap-3 w-full sm:flex-col">
        <Data
          activeChain={activeChain}
          activePool={activePool}
          computedData={computedData}
        />
        <Lock
          activeChain={activeChain}
          activePool={activePool}
          readcallData={readcallData}
          totalLocked={computedData.totalLocked}
          totalUnlocked={computedData.totalUnlocked}
        />
        <HowItWorks />
      </div>
      <Transactions
        activePool={activePool}
        activeChain={activeChain}
        data={data.nftPoolTxns}
        error={error}
        pendingRewards={pendingRewards}
        pendingRewardsError={pendingRewardsError}
        totalTxns={data.totalTxns[0].totalTxns}
      />
    </div>
  );
};
