import { poolsType } from '@Views/LpRewards/types';
import { Chain } from 'viem';
import { ActionCard } from './ActionCard';
import { UserData } from './UserData';

export const Deposit: React.FC<{
  activePool: poolsType;
  readCallData: { [callId: string]: string[] };
  activeChain: Chain;
}> = ({ activePool, readCallData, activeChain }) => {
  return (
    <div className="mt-[64px] w-full sm:mt-[32px]">
      <div className="text-#FFFFFF text-f20 font-medium leading-[18px] pb-[20px]">
        My Deposits
      </div>
      <div className="flex items-start gap-3 w-full sm:flex-col">
        <UserData
          activePool={activePool}
          readcallData={readCallData}
          activeChain={activeChain}
        />
        <ActionCard
          activePool={activePool}
          readcalldata={readCallData}
          activeChain={activeChain}
        />
      </div>
    </div>
  );
};
