import { Display } from '@Views/Common/Tooltips/Display';
import { useUSDCapr } from '@Views/LpRewards/Hooks/useUSDCapr';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { Skeleton } from '@mui/material';
import { Chain } from 'wagmi';

export const APR: React.FC<{
  activeChain: Chain;
  lockTxn: lockTxn;
  activePool: poolsType;
}> = ({ activeChain, lockTxn, activePool }) => {
  const { getLockAPR } = useUSDCapr(activeChain, activePool);
  const lockAPR = getLockAPR(
    parseInt(lockTxn.lockPeriod),
    Math.floor(new Date().getTime() / 1000) >
      parseInt(lockTxn.timestamp) + parseInt(lockTxn.lockPeriod)
  );
  if (lockAPR === null) {
    return <Skeleton className="w-[70px] !h-6 lc !transform-none" />;
  }
  if (lockAPR === undefined) {
    return <span className="text-f15">Something went wrong</span>;
  }
  return (
    <span className="text-f15">
      <Display
        data={lockAPR}
        unit="%"
        precision={2}
        className="!justify-start"
      />
    </span>
  );
};
