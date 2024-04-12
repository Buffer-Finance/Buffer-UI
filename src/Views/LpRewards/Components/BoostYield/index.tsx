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
  return (
    <div className="mt-[64px] w-full">
      <div className="text-#FFFFFF text-f20 font-medium leading-[18px] pb-[20px]">
        Boost Yield
      </div>
      <div className="flex items-start gap-3 w-full">
        <Data activeChain={activeChain} activePool={activePool} />
        <Lock activeChain={activeChain} activePool={activePool} />
        <HowItWorks />
      </div>
      <Transactions activePool={activePool} activeChain={activeChain} />
    </div>
  );
};
