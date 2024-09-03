import { poolToTokenMapping } from '../../config';
import { poolsType } from '../../types';

export const PoolHeading: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  return (
    <div className="text-[#7F87A7] text-f16 font-medium mt-2">
      Provide {poolToTokenMapping[activePool]} and earn 95% of the trading fee.
    </div>
  );
};
