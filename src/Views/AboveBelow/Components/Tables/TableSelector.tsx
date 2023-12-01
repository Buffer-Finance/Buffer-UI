import { accordianTableType } from '@Views/AboveBelow/types';

export const TableSelector: React.FC<{
  activeTableName: accordianTableType;
}> = ({ activeTableName }) => {
  switch (activeTableName.toLowerCase()) {
    case 'history':
      return <>History</>;
    case 'cancelled':
      return <>Cancelled</>;
    default:
      return <>default</>;
  }
};
