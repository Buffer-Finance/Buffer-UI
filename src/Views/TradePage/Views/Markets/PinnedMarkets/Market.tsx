import { useActiveChain } from '@Hooks/useActiveChain';
import Star from '@Public/ComponentSVGS/Star';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useChartMarketData } from '@Views/TradePage/Hooks/useChartMarketData';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useFavouriteMarkets } from '@Views/TradePage/Hooks/useFavouriteMarkets';
import { assetSelectorPoolAtom } from '@Views/TradePage/atoms';
import { appConfig } from '@Views/TradePage/config';
import { marketType } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

const MarketBackground = styled.button<{ isActive: boolean }>`
  all: unset;
  cursor: pointer;
  background: transparent;
  border: 1px solid #232334;
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#DDDDE3')};
  font-size: 12px;
  font-weight: 400;
  line-height: 13px;
  padding: 5px 12px;
  width: fit-content;

  border-left: none;
`;

export const Market: React.FC<{
  market: marketType;
}> = ({ market }) => {
  const selectedPool = useAtomValue(assetSelectorPoolAtom);
  const { activeChain } = useActiveChain();
  const { activeMarket } = useActiveMarket();
  const { getChartMarketData } = useChartMarketData();
  const { navigateToMarket } = useFavouriteMarkets();
  const chartMarket = getChartMarketData(market.token0, market.token1);
  const { currentPrice } = useCurrentPrice({
    token0: market.token0,
    token1: market.token1,
  });

  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;

  const {
    favouriteMarkets: favourites,
    addFavouriteMarket,
    removeFavouriteMarket,
  } = useFavouriteMarkets();

  const isOpen = useMemo(() => {
    //TODO: V2.1 - add forex and market timing check
    const currentPool = market.pools.find((pool) => {
      const foundPool = pools[pool.pool as keyof typeof pools];
      return foundPool && foundPool.token === selectedPool && !foundPool.is_pol;
    });
    return !currentPool?.isPaused;
  }, [selectedPool, market]);

  const isActive = useMemo(() => {
    if (activeMarket === undefined) return false;
    return (
      joinStrings(activeMarket?.token0, activeMarket?.token1, '') ===
      joinStrings(market.token0, market.token1, '')
    );
  }, [activeMarket, market]);

  const isFavourite = useMemo(() => {
    return favourites.find(
      (favourite) =>
        chartMarket.tv_id ===
        joinStrings(favourite.token0, favourite.token1, '')
    );
  }, [favourites, chartMarket]);

  function handleFavourite(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    removeFavouriteMarket(market);
  }

  const { token0, token1 } = market;

  function handleMarketClick() {
    navigateToMarket(market);
  }

  return (
    <MarketBackground isActive={isActive} onClick={handleMarketClick}>
      <RowGap gap="6px">
        <IconButton onClick={handleFavourite} className="!p-2">
          <Star active={isFavourite} />
        </IconButton>
        <div className="h-[16px] w-[16px]">
          <PairTokenImage pair={joinStrings(token0, token1, '-')} />
        </div>
        {token0}/{token1}
        {isOpen ? (
          <Display
            data={currentPrice}
            colored
            precision={chartMarket.price_precision.toString().length - 1}
          />
        ) : (
          <div className="text-[#D34A4A]"> CLOSED</div>
        )}
      </RowGap>
    </MarketBackground>
  );
};
