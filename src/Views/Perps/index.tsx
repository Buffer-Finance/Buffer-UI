import { usePriceRetriable } from '@Hooks/usePrice';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { AccordionTable } from './Views/AccordionTable';
import { BuyTrade } from './Views/BuyTrade/BuyTrade';
import { MarketChart } from './Views/MarketChart';
import { MarketStatsBar } from './Views/MarketChart/MarketStatsBar';
import { PinnedMarkets } from './Views/Markets/PinnedMarkets';
import { tradePanelPosition } from './type';
import {
  miscsSettingsAtom,
  tradePanelPositionSettingsAtom,
} from '@Views/TradePage/atoms';

const PerpsTrader: React.FC<any> = ({}) => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);
  usePriceRetriable();
  return (
    <>
      <div
        className={`flex h-full justify-between w-[100%] bg-[#1C1C28] ${
          panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
        }`}
      >
        <>
          <RightPanelBackground>
            {showFavoriteAsset && <PinnedMarkets />}
            <MarketStatsBar />
            <MarketChart />
            <AccordionTable />
          </RightPanelBackground>
          <BuyTrade />
        </>
      </div>
    </>
  );
};

export { PerpsTrader };

const RightPanelBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  width: 100%;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
`;
