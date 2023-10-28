import { TradePageNoLoss } from './Components/Trade';
import { useNoLossMarkets } from './Hooks/useNoLossMarkets';
import { useTournamentDataFetch } from './Hooks/useTournamentDataFetch';
import { useTournamentIds } from './Hooks/useTournamentIds';

export const NoLossV3 = () => {
  useTournamentIds();
  useNoLossMarkets();
  useTournamentDataFetch();

  return <TradePageNoLoss />;
};
