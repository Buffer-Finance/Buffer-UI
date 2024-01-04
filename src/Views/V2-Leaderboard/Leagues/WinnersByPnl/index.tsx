import { useUserAccount } from '@Hooks/useUserAccount';
import { DailyWebTable } from '@Views/V2-Leaderboard/Daily/DailyWebTable';
import { ROWINAPAGE } from '@Views/V2-Leaderboard/Weekly';
import { useMemo, useState } from 'react';
import { Winners } from '../Winners';
import { leagueType } from '../atom';
import { leaguesConfig } from '../config';
import { useWinnersByPnlWeekly } from './useWinnersByPnlWeekly';

export const WinnersByPnl = ({
  activeChainId,
  config,
  league,
  offset,
  week,
}: {
  league: leagueType;
  offset: string | null;
  activeChainId: number;
  week: number;
  config: leaguesConfig;
}) => {
  const { address: account } = useUserAccount();
  const [activePage, setActivePage] = useState(1);
  const { data } = useWinnersByPnlWeekly({
    league,
    week,
    offset,
    config,
    activeChainId,
    account,
  });
  const totalPages =
    data && data.weeklyLeaderboards.length > 0
      ? Math.ceil(data.weeklyLeaderboards.length / ROWINAPAGE)
      : 0;
  const skip = (activePage - 1) * ROWINAPAGE;
  const winnerUserRank = useMemo(() => {
    if (!data || !data.weeklyLeaderboards || !account) return '-';
    const rank = data.weeklyLeaderboards.findIndex(
      (data) => data.user.toLowerCase() == account.toLowerCase()
    );

    if (rank === -1) return '-';
    else return (rank + 1).toString();
  }, [data?.userData, account]);

  const participants = useMemo(() => {
    if (!data?.weeklyLeaderboards)
      return {
        winners: undefined,
        others: undefined,
      };

    return {
      winners: data?.weeklyLeaderboards.slice(0, 3),
      others: data?.weeklyLeaderboards.slice(3),
    };
  }, [data?.weeklyLeaderboards]);

  return (
    <>
      <Winners winners={participants.winners} />
      <DailyWebTable
        standings={participants.others}
        count={totalPages}
        onpageChange={setActivePage}
        activePage={activePage}
        userData={data?.userData}
        skip={skip}
        nftWinners={config.winnersNFT}
        userRank={winnerUserRank}
      />
    </>
  );
};
