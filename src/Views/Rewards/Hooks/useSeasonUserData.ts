import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useDailyLeaderboardData } from '@Views/V2-Leaderboard/Incentivised/useDailyLeaderBoardData';
import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import { useWinnersByPnlWeekly } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/useWinnersByPnlWeekly';
import axios from 'axios';
import useSWR from 'swr';

export const useSeasonUserData = (weekId: number, league: string) => {
  console.log(`weekId: `, weekId);
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const config = getConfig(activeChain.id);
  // const {offset} = useOff
  const data = useWinnersByPnlWeekly({
    league: league,
    activeChainId: activeChain.id,
    offset: 0,
    weekId: weekId,
    account: address,
  });
  console.log(`data: `, data);
  return data;
};
