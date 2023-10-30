import { TradePageNoLoss } from './Components/Trade';
import { useNoLossMarkets } from './Hooks/useNoLossMarkets';
import { useTournamentDataFetch } from './Hooks/useTournamentDataFetch';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { useUpdateActiveMarket } from './Hooks/useUpdateActiveMarket';

export const NoLossV3 = () => {
  useTournamentIds();
  useNoLossMarkets();
  useTournamentDataFetch();
  useUpdateActiveMarket();

  return <TradePageNoLoss />;
};
