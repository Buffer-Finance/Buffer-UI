import { useEffect } from 'react';
import { Seasons } from './Components/Seasons';

export const RewardsPage = () => {
  useEffect(() => {
    document.title = 'Rewards';
  }, []);
  return (
    <div className="w-[325px] m-auto bg-[#141823] rounded-md">
      <div className="text-f20 font-medium text-[#F7F7F7] m-auto w-fit mt-5 mb-3">
        All Seasons
      </div>
      <Seasons />
    </div>
  );
};
