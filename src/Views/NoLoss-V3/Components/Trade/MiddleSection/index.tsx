import { MarketChart } from '@Views/TradePage/Views/MarketChart';
import styled from '@emotion/styled';
import { PinnedMarkets } from '../PinnedMarkets';
import { StatusBar } from '../StatusBar';

export const MiddleSection = () => {
  return (
    <MiddleSectionBackground>
      <PinnedMarkets />
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
