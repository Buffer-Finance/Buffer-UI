import { usePriceRetriable } from '@Hooks/usePrice';
import { TradePageNoLoss } from './Components/Trade';
import { useAllTournamentData } from './Hooks/useAllTournamentdata';
import { useLeaderboardData } from './Hooks/useLeaderboardData';
import { useNoLossMarkets } from './Hooks/useNoLossMarkets';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { useUpdateActiveMarket } from './Hooks/useUpdateActiveMarket';
import { useUpdateActiveTournament } from './Hooks/useUpdateActiveTournament';

export const NoLossV3 = () => {
  useTournamentIds();
  useNoLossMarkets();
  // useTournamentDataFetch();
  useUpdateActiveMarket();
  usePriceRetriable();
  useUpdateActiveTournament();
  useLeaderboardData();
  useAllTournamentData();

  return <TradePageNoLoss />;
};
