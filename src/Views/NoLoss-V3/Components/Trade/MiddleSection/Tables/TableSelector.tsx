import { accordianTableType } from '@Views/NoLoss-V3/types';
import { CancelledTable } from './Cancelled';
import { HistoryTable } from './History';
import { LeaderboardTable } from './LeaderboardTable';

export const TableSelector: React.FC<{
  activeTableName: accordianTableType;
}> = ({ activeTableName }) => {
  switch (activeTableName.toLowerCase()) {
    case 'leaderboard':
      return <LeaderboardTable />;
    case 'history':
      return <HistoryTable />;
    case 'cancelled':
      return <CancelledTable />;
    default:
      return <>default</>;
  }
};
