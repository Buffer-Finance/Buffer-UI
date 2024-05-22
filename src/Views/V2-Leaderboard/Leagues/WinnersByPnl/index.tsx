import { useUserAccount } from '@Hooks/useUserAccount';
import { useEffect, useState } from 'react';
import { leagueType } from '../atom';
import { useWinnersByPnlWeekly } from './useWinnersByPnlWeekly';
import { WebTable } from './Tables/WebTable';
import { LeaderBoardTabs } from '@Views/V2-Leaderboard/Galxe';
import TabSwitch from '@Views/Common/TabSwitch';
const tabList = [
  { name: 'Winners' },
  { name: 'Losers' },
  // { name: 'Winners (by Win Rate)' },
  // { name: 'Losers (by Win Rate)' },
];
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
  const [activeTab, setActiveTab] = useState(0);
  const { address: account } = useUserAccount();
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

  useEffect(() => {
    if (activeTab > tabList.length - 1) {
      setActiveTab(0);
    }
  }, [offset]);

  return (
    <>
      <LeaderBoardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabList={tabList}
      />
      {/* <Winners winners={participants.winners} /> */}
      <TabSwitch
        value={activeTab}
        childComponents={[
          <WebTable data={data?.winners} isWinnersTable />,
          <WebTable data={data?.loosers} isWinnersTable={false} />,
        ]}
      />
    </>
  );
};
