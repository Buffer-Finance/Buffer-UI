import { useEffect } from 'react';
import { Summary } from './Components/Summary';
import { LeagueWiseData } from './LeagueWiseData';

export const RewardsPage = () => {
  useEffect(() => {
    document.title = 'Rewards';
  }, []);
  return (
    <div className="w-full py-6 px-8 sm:px-6">
      <LeagueWiseData />
      <Summary />
    </div>
  );
};
