import { poolsType } from '@Views/LpRewards/types';
import { Chain } from 'viem';
import { PoolStats } from '../PoolStats';
import { Graphs } from './Graphs';
import { PoolHeading } from './PoolHeading';

export const PoolData: React.FC<{
  activePool: poolsType;
  readCallData: { [callId: string]: string[] };
  activeChain: Chain;
}> = ({ activePool, readCallData, activeChain }) => {
  return (
    <div>
      <PoolHeading activePool={activePool} />
      <div className="mt-6 flex gap-4 items-start sm:flex-col-reverse sm:w-full">
        <PoolStats
          activePool={activePool}
          readCallData={readCallData}
          activeChain={activeChain}
        />
        <Graphs activeChain={activeChain} activePool={activePool} />
      </div>
    </div>
  );
};
