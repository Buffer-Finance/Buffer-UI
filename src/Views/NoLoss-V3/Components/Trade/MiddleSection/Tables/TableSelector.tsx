import { userAtom } from '@Views/NoLoss-V3/atoms';
import { accordianTableType } from '@Views/NoLoss-V3/types';
import { useAtomValue } from 'jotai';
import { CancelledTable } from './Cancelled';
import { HistoryTable } from './History';
import { LeaderboardTable } from './LeaderboardTable';

export const TableSelector: React.FC<{
  activeTableName: accordianTableType;
}> = ({ activeTableName }) => {
  const user = useAtomValue(userAtom);
  switch (activeTableName.toLowerCase()) {
    case 'leaderboard':
      return <LeaderboardTable />;
    case 'history':
      return <HistoryTable userAddress={user?.userAddress} />;
    case 'cancelled':
      return <CancelledTable userAddress={user?.userAddress} />;
    default:
      return <>default</>;
  }
};
