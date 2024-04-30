import { useUserAccount } from '@Hooks/useUserAccount';
import { useEffect } from 'react';
import { Summary } from './Components/Summary';
import { LeagueWiseData } from './LeagueWiseData';

const RewardsPage = () => {
  const { address } = useUserAccount();
  useEffect(() => {
    document.title = 'Rewards';
  }, []);
  return (
    <div className="w-full py-6 px-8 sm:px-6">
      <LeagueWiseData />
      {address && <Summary />}
    </div>
  );
};

export default RewardsPage;
