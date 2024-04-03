import { poolsType } from '@Views/LpRewards/types';
import { Data } from './Data';
import { HowItWorks } from './HowItWorks';
import { Transactions } from './Transactions';

export const BoostYield: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  return (
    <div className="mt-[64px] w-full">
      <div className="text-#FFFFFF text-f20 font-medium leading-[18px] pb-[20px]">
        Boost Yield
      </div>
      <div className="flex items-start gap-3 w-full">
        <Data />
        <HowItWorks />
      </div>
      <Transactions activePool={activePool} />
    </div>
  );
};
