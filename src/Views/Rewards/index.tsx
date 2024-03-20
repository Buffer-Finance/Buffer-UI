import { useEffect } from 'react';
import { OverAllData } from './Components/OverAllData';
import { Seasons } from './Components/Seasons';
import { Summary } from './Components/Summary';
import { UserRewards } from './Components/UserRewards';

export const RewardsPage = () => {
  useEffect(() => {
    document.title = 'Rewards';
  }, []);
  return (
    <div className="w-full py-6 px-8">
      <div className="flex justify-between items-start w-full">
        <div>
          <OverAllData />
          <UserRewards />
        </div>
        <Seasons />
      </div>
      <Summary />
    </div>
  );
};
