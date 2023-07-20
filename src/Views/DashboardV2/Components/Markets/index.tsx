import { useMarketsData } from '@Views/DashboardV2/hooks/useMarketsData';
import { MarketsTable } from './MarketsTable';

export const Markets = () => {
  const { markets } = useMarketsData();
  // console.log(markets, 'markets');
  return <MarketsTable dashboardData={markets} />;
};
