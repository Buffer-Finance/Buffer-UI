import { useGenericHooks } from '@Hooks/useGenericHook';
import { usePriceRetriable } from '@Hooks/usePrice';
import { MarketTimingsModal } from '@Views/TradePage/Components/MarketTimingsModal';
import { useAtomValue } from 'jotai';
import { useMedia } from 'react-use';
import { TradePageNoLoss } from './Components/Trade';
import { TradePageMobile } from './Components/Trade/MobileTradePage';
import { Shutters } from './Components/Trade/MobileTradePage/Shutters';
import { useAllTournamentData } from './Hooks/useAllTournamentdata';
import { useLeaderboardData } from './Hooks/useLeaderboardData';
import { useNoLossMarkets } from './Hooks/useNoLossMarkets';
import { tardesAtom, usePastTradeQuery } from './Hooks/usePastTradeQuery';
import { useTournamentIds } from './Hooks/useTournamentIds';
import { useUpdateActiveMarket } from './Hooks/useUpdateActiveMarket';
import { useUpdateActiveTournament } from './Hooks/useUpdateActiveTournament';

export const NoLossV3 = () => {
  const { active } = useAtomValue(tardesAtom);
  useTournamentIds();
  useNoLossMarkets();
  useUpdateActiveMarket();
  usePriceRetriable();
  useUpdateActiveTournament();
  useLeaderboardData();
  useAllTournamentData();
  useGenericHooks(active);
  usePastTradeQuery();
  const isNotMobile = useMedia('(min-width:1200px)');

  return isNotMobile ? (
    <>
      <TradePageNoLoss isMobile={!isNotMobile} />
      <MarketTimingsModal />
    </>
  ) : (
    <>
      <Shutters />
      <TradePageMobile />
    </>
  );
};
