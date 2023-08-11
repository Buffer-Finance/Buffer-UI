import { useMarketsData } from '@Views/DashboardV2/hooks/useMarketsData';
import { MarketsTable } from './MarketsTable';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '@Views/DashboardV2/atoms';

export const Markets = () => {
  const markets = useFilteredMarkets();
  return (
    <MarketsTable dashboardData={markets} activePage={0} loading={!markets} />
  );
};

const useFilteredMarkets = () => {
  const activeToken = useAtomValue(tokenAtom);
  const { markets } = useMarketsData();

  if (!markets) return [];
  return markets.filter((market) =>
    activeToken.includes(market.poolUnit.toUpperCase())
  );
};
