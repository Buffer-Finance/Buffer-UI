import { useMarketsData } from '@Views/DashboardV2/hooks/useMarketsData';
import { MarketsTable } from './MarketsTable';

export const Markets = () => {
  const { markets } = useMarketsData();
  return (
    <MarketsTable dashboardData={markets} activePage={0} loading={!markets} />
  );
};
