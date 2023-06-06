import { useActiveChain } from '@Hooks/useActiveChain';
import { priceAtom } from '@Hooks/usePrice';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { assetSelectorPoolAtom } from '@Views/TradePage/atoms';
import { appConfig, marketsForChart } from '@Views/TradePage/config';
import { marketType } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

const MarketBackground = styled.div<{ isActive: boolean }>`
  background: transparent;
  border-left: 1px solid #232334;
  border-right: 1px solid #232334;
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#dddde3')};
  font-size: 12px;
  font-weight: 400;
  line-height: 13px;
  padding: 5px 12px;
  width: fit-content;
`;

export const Market: React.FC<{
  market: marketType;
}> = ({ market }) => {
  const [marketPrice] = useAtom(priceAtom);
  const selectedPool = useAtomValue(assetSelectorPoolAtom);
  const { activeChain } = useActiveChain();
  const { activeMarket } = useActiveMarket();

  const marketIdData = joinStrings(market.token0, market.token1, '');
  const chartMarketData =
    marketsForChart[marketIdData as keyof typeof marketsForChart];
  const price = getPriceFromKlines(marketPrice, chartMarketData);
  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;

  const isOpen = useMemo(() => {
    //TODO: V2.1 - add forex and market timing check
    const currentPool = market.pools.find((pool) => {
      const foundPool = pools[pool.pool as keyof typeof pools];
      return foundPool && foundPool.token === selectedPool && !foundPool.is_pol;
    });
    return !currentPool?.isPaused;
  }, [selectedPool, market]);

  const isActive = useMemo(() => {
    return activeMarket === market;
  }, [activeMarket, market]);

  const { token0, token1 } = market;

  return (
    <MarketBackground isActive={isActive}>
      <RowGap gap="6px">
        <div className="h-[20px] w-[20px]">
          <PairTokenImage pair={joinStrings(token0, token1, '-')} />
        </div>
        {token0}/{token1}
        {isOpen ? (
          <Display data={price} colored />
        ) : (
          <div className="text-[#D34A4A]"> CLOSED</div>
        )}
      </RowGap>
    </MarketBackground>
  );
};
