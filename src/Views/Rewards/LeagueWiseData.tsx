import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import { useState } from 'react';
import { OverAllData } from './Components/OverAllData';
import { Seasons } from './Components/Seasons';
import SeasonsShutter from './Components/SeasonsShutter';
import { UserRewards } from './Components/UserRewards';
import { startWeekId } from './config';

export const LeagueWiseData = () => {
  const currentWeekId = getWeekId(0);
  const defaultSelectedId =
    currentWeekId === startWeekId ? startWeekId : getWeekId(0) - 1;
  const [selectedWeekId, setSelectedWeekId] = useState(defaultSelectedId);
  const selectedSeason = selectedWeekId - startWeekId + 1;
  const setSelectedSeason = (season: number) => {
    setSelectedWeekId(season + startWeekId - 1);
  };
  return (
    <div className="flex justify-between items-start w-full">
      <div className="w-full">
        <OverAllData
          selectedSeason={selectedSeason}
          selectedWeekId={selectedWeekId}
          currentWeekId={currentWeekId}
        />
        <UserRewards
          selectedWeekId={selectedWeekId}
          currentWeekId={currentWeekId}
        />
      </div>
      <div className="sm:hidden">
        <Seasons
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
      </div>
      <div className="a600:hidden">
        <SeasonsShutter
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
      </div>
    </div>
  );
};
