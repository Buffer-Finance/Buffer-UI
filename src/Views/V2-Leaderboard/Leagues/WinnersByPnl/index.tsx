import { useUserAccount } from '@Hooks/useUserAccount';
import { DailyWebTable } from '@Views/V2-Leaderboard/Daily/DailyWebTable';
import { useState } from 'react';
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
    activeChainId,
    account,
  });

  return (
    <>
      {/* <Winners winners={participants.winners} /> */}
      <DailyWebTable
        winners={data?.winners}
        loosers={data?.loosers}
        total_count={data?.total_count}
        count={1}
        onpageChange={setActivePage}
        activePage={activePage}
        userData={undefined}
        skip={0}
        nftWinners={config.winnersNFT}
        userRank={'-'}
        offSet={'1'} // always >0 to show points
      />
    </>
  );
};
