import { MarketTimingsModal } from '@Views/TradePage/Components/MarketTimingsModal';
import { useAtomValue } from 'jotai';
import { useMedia } from 'react-use';
import { TradePageNoLoss } from './Components/Trade';
import { TradePageMobile } from './Components/Trade/MobileTradePage';
import { Shutters } from './Components/Trade/MobileTradePage/Shutters';
import { tardesAtom } from './Hooks/usePastTradeQuery';
import { useTournamentIds } from './Hooks/useTournamentIds';

export const NoLossV3 = () => {
  const { active } = useAtomValue(tardesAtom);

  useTournamentIds();
  // useNoLossMarkets();
  // useUpdateActiveMarket();
  // usePriceRetriable();
  // useUpdateActiveTournament();
  // useLeaderboardData();
  // useAllTournamentData();
  // useGenericHooks(active);
  // usePastTradeQuery();

  console.log('Rerendered');

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
