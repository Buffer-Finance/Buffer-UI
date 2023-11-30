import { useActiveChain } from '@Hooks/useActiveChain';
import { usePriceRetriable } from '@Hooks/usePrice';
import { MobileWarning, RightPanelBackground } from '@Views/TradePage';
import {
  miscsSettingsAtom,
  tradePanelPositionSettingsAtom,
} from '@Views/TradePage/atoms';
import { tradePanelPosition } from '@Views/TradePage/type';
import { useAtomValue } from 'jotai';
import { polygon, polygonMumbai } from 'viem/chains';
import { BuyTrade } from './Components/BuyTrade';
import { PinnedMarkets } from './Components/PinnedMarkets';
import { StatusBar } from './Components/StatusBar';
import { useAboveBelowMarketsSetter } from './Hooks/useAboveBelowMarketsSetter';
import { useActiveMarketSetter } from './Hooks/useActiveMarketSetter';

export const AboveBelow = () => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);
  usePriceRetriable();
  const { activeChain } = useActiveChain();
  if ([polygon.id, polygonMumbai.id].includes(activeChain.id as 80001)) {
    return <MobileWarning />;
  }
  useAboveBelowMarketsSetter();
  useActiveMarketSetter();

  return (
    <div
      className={`flex h-full justify-between w-[100%] bg-[#1C1C28] ${
        panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
      }`}
    >
      <>
        <RightPanelBackground>
          {showFavoriteAsset && <PinnedMarkets />}
          <StatusBar isMobile={false} />
          {/* <MarketChart /> */}
          {/* <AccordionTable /> */}
        </RightPanelBackground>
        <BuyTrade />
      </>
    </div>
  );
};
