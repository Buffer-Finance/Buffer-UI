import { useActiveChain } from '@Hooks/useActiveChain';
import { usePriceRetriable } from '@Hooks/usePrice';
import { MobileWarning, RightPanelBackground } from '@Views/TradePage';
import {
  miscsSettingsAtom,
  tradePanelPositionSettingsAtom,
} from '@Views/TradePage/atoms';
import { tradePanelPosition } from '@Views/TradePage/type';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { polygon, polygonMumbai } from 'viem/chains';
import { BuyTrade } from './Components/BuyTrade';
import { MarketChart } from './Components/MarketChart';
import { MarketPicker } from './Components/MobileView/MarketPicker';
import { Shutters } from './Components/MobileView/Shutters';
import { Tabs } from './Components/MobileView/Tabs';
import { PinnedMarkets } from './Components/PinnedMarkets';
import { StatusBar } from './Components/StatusBar';
import { Tables } from './Components/Tables';
import { useAboveBelowMarketsSetter } from './Hooks/useAboveBelowMarketsSetter';
import { useActiveMarketSetter } from './Hooks/useActiveMarketSetter';
import { usePastTradeQuery } from './Hooks/usePastTradeQuery';
import { useReacallDataSetter } from './Hooks/useReadcallDataSetter';
import {
  aboveBelowActiveMarketsAtom,
  selectedPoolActiveMarketAtom,
  setSelectedPoolForTradeAtom,
} from './atoms';
import { MobileHistory } from './Components/MobileView/MobileHistory';

export const AboveBelow = () => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);
  const { activeChain } = useActiveChain();
  usePriceRetriable();
  useAboveBelowMarketsSetter();
  useActiveMarketSetter();
  useReacallDataSetter();
  usePastTradeQuery();
  const setActivePoolMarket = useSetAtom(setSelectedPoolForTradeAtom);
  const selectedPoolMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const markets = useAtomValue(aboveBelowActiveMarketsAtom);
  const isNotMobile = useMedia('(min-width:1200px)');

  useEffect(() => {
    if (markets.length > 0) {
      if (!selectedPoolMarket) {
        setActivePoolMarket(markets[0].poolInfo.token.toUpperCase());
      }
    }
  }, [markets.length]);

  if ([polygon.id, polygonMumbai.id].includes(activeChain.id as 80001)) {
    return <MobileWarning />;
  }
  if (isNotMobile) return <Tables />;
  else {
    return <MobileHistory />;
  }
};
