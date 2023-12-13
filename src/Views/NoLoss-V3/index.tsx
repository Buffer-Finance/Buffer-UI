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
import { useSmartWallet } from '@Hooks/AA/useSmartAccount';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getLocalSigner } from '@Hooks/AA/getLocalSigner';

export const NoLossV3 = () => {
  const { address } = useAccount();
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
  const localSigner = () => {
    if (!address) return;
    const signer = getLocalSigner(address);
    console.log(`index-signer: `, signer);
  };
  return isNotMobile ? (
    <>
      <button onClick={localSigner}>Click</button>
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
