import { useActiveChain } from '@Hooks/useActiveChain';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { usePriceRetriable } from '@Hooks/usePrice';
import { MobileWarning, RightPanelBackground } from '@Views/TradePage';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { AccordionTable } from '@Views/TradePage/Views/AccordionTable';
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
import { useAboveBelowMarketsSetter } from './Hooks/useAboveBelowMarketsSetter';
import { useActiveMarketSetter } from './Hooks/useActiveMarketSetter';
import { useReacallDataSetter } from './Hooks/useReadcallDataSetter';
import {
  aboveBelowActiveMarketsAtom,
  selectedPoolActiveMarketAtom,
  setSelectedPoolForTradeAtom,
} from './atoms';

export const AboveBelow = () => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);
  const { activeChain } = useActiveChain();
  usePriceRetriable();
  useAboveBelowMarketsSetter();
  useActiveMarketSetter();
  useReacallDataSetter();
  // usePastTradeQuery();
  // useGenericHooks(active);

  const setActivePoolMarket = useSetAtom(setSelectedPoolForTradeAtom);
  const selectedPoolMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const markets = useAtomValue(aboveBelowActiveMarketsAtom);
  const isNotMobile = useMedia('(min-width:1200px)');

  if ([polygon.id, polygonMumbai.id].includes(activeChain.id as 80001)) {
    return <MobileWarning />;
  }

  useEffect(() => {
    if (markets.length > 0) {
      if (!selectedPoolMarket) {
        setActivePoolMarket(markets[0].poolInfo.token.toUpperCase());
      }
    }
  }, [markets.length]);
  if (isNotMobile)
    return (
      <div
        className={`flex h-full justify-between w-[100%] bg-[#1C1C28] ${
          panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
        }`}
      >
        <>
          <TradeEndNotification />
          <RightPanelBackground>
            {showFavoriteAsset && <PinnedMarkets />}
            <StatusBar isMobile={false} />
            <MarketChart isMobile={false} />
            {/* <Tables /> */}
            <AccordionTable />
          </RightPanelBackground>
          <BuyTrade isMobile={false} />
        </>
      </div>
    );
  else {
    return (
      <div className="flex flex-col  h-full w-full m-auto px-3 a600:w-[500px]">
        <Shutters />
        <MarketPicker />
        <Tabs />
      </div>
    );
  }
};

const TradeEndNotification = () => {
  const trades = useOngoingTrades();
  useGenericHooks(trades);
  return <></>;
};
