import { poolsType } from '@Views/LpRewards/types';
import { PoolStats } from '../PoolStats';
import { PoolHeading } from './PoolHeading';

export const PoolData: React.FC<{
  activePool: poolsType;
}> = ({ activePool }) => {
  return (
    <div>
      <PoolHeading activePool={activePool} />
      <div className="mt-6">
        <PoolStats activePool={activePool} />
      </div>
    </div>
  );
};
