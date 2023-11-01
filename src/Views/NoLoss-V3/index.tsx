import { usePriceRetriable } from '@Hooks/usePrice';
import { TradePageNoLoss } from './Components/Trade';
import { useNoLossMarkets } from './Hooks/useNoLossMarkets';
import { usePastTradeQuery } from './Hooks/usePastTradeQuery';
import { useTournamentDataFetch } from './Hooks/useTournamentDataFetch';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { useUpdateActiveMarket } from './Hooks/useUpdateActiveMarket';
import { useUpdateActiveTournament } from './Hooks/useUpdateActiveTournament';

export const NoLossV3 = () => {
  useTournamentIds();
  useNoLossMarkets();
  useTournamentDataFetch();
  useUpdateActiveMarket();
  usePriceRetriable();
  useUpdateActiveTournament();
  usePastTradeQuery();

  return <TradePageNoLoss />;
};
