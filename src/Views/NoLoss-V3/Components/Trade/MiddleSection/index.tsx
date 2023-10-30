import { MarketChart } from '@Views/TradePage/Views/MarketChart';
import { miscsSettingsAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { PinnedMarkets } from '../PinnedMarkets';
import { StatusBar } from '../StatusBar';

export const MiddleSection = () => {
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);

  return (
    <MiddleSectionBackground>
      {showFavoriteAsset && <PinnedMarkets />}
      <StatusBar isMobile={false} />
      <MarketChart />
    </MiddleSectionBackground>
  );
};

const MiddleSectionBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  width: 100%;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
`;
