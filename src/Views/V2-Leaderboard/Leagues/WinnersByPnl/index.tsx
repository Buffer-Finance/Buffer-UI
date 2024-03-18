import { useUserAccount } from '@Hooks/useUserAccount';
import { DailyWebTable } from '@Views/V2-Leaderboard/Daily/DailyWebTable';
import { useState } from 'react';
import { leagueType } from '../atom';
import { useWinnersByPnlWeekly } from './useWinnersByPnlWeekly';

export const WinnersByPnl = ({
  activeChainId,

  league,
  offset,
  week,
}: {
  league: leagueType;
  offset: string | null;
  activeChainId: number;
  week: number;
}) => {
  const { address: account } = useUserAccount();
  const [activePage, setActivePage] = useState(1);
  const { data } = useWinnersByPnlWeekly({
    league,
    week,
    offset,
    activeChainId,
    account,
  });
  let totalCount = 0;
  if (data) {
    if (data.loosers !== undefined && data.winners !== undefined) {
      totalCount = data.loosers.length + data.winners.length;
    } else if (data.loosers !== undefined && data.winners === undefined) {
      totalCount = data.loosers.length;
    } else if (data.loosers === undefined && data.winners !== undefined) {
      totalCount = data.winners.length;
    }
  } else {
    totalCount = 0;
  }

  return (
    <>
      {/* <Winners winners={participants.winners} /> */}
      <DailyWebTable
        winners={data?.winners}
        loosers={data?.loosers}
        total_count={totalCount}
        count={1}
        onpageChange={setActivePage}
        activePage={activePage}
        userData={undefined}
        skip={0}
        nftWinners={0}
        userRank={'-'}
        offSet={'1'} // always >0 to show points
        isWeekly
      />
    </>
  );
};
