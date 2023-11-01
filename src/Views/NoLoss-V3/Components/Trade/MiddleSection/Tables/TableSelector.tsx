import { accordianTableType } from '@Views/NoLoss-V3/types';
import { LeaderboardTable } from './LeaderboardTable';

export const TableSelector: React.FC<{
  activeTableName: accordianTableType;
}> = ({ activeTableName }) => {
  switch (activeTableName.toLowerCase()) {
    case 'leaderboard':
      return <LeaderboardTable />;
    case 'history':
      return <>history</>;
    case 'cancelled':
      return <>cancelled</>;
    default:
      return <>default</>;
  }
};
