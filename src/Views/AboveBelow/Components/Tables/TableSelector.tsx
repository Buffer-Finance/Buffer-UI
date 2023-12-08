import { useUserAccount } from '@Hooks/useUserAccount';
import { accordianTableType } from '@Views/AboveBelow/types';
import { AllActive } from '../AllTrades/Active';
import { AllHistory } from '../AllTrades/History';
import { ActiveTable } from './Web/ActiveTable';
import { CancelledTable } from './Web/CancelledTable';
import { HistoryTable } from './Web/HistoryTable';

export const TableSelector: React.FC<{
  activeTableName: accordianTableType;
}> = ({ activeTableName }) => {
  const { address } = useUserAccount();
  switch (activeTableName.toLowerCase()) {
    case 'active':
      return <ActiveTable userAddress={address} />;
    case 'history':
      return <HistoryTable userAddress={address} />;
    case 'cancelled':
      return <CancelledTable userAddress={address} />;
    case 'platform_active':
      return <AllActive />;
    case 'platform_history':
      return <AllHistory />;
    default:
      return <>default</>;
  }
};
