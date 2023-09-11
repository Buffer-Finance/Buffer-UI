import Star from '@Public/ComponentSVGS/Star';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { marketData } from '@Views/TradePage/Hooks/useAssetTableFilters';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useFavouriteMarkets } from '@Views/TradePage/Hooks/useFavouriteMarkets';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { AssetCategory } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { useMemo } from 'react';
import { getAddress } from 'viem';

const MarketBackground = styled.button<{ isActive: boolean }>`
  all: unset;
  cursor: pointer;
  background: transparent;
  border: 1px solid #232334;
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#808191')};
  font-size: 12px;
  font-weight: 400;
  line-height: 13px;
  padding: 5px 12px;
  width: fit-content;

  border-left: none;
`;

const isMarketOpen = (
  category: number,
  isInCreationWindow: boolean | undefined
) => {
  if (!isMarketForex(category)) {
    return true;
  }

  return !!isInCreationWindow;
};

const isMarketForex = (category: number) => {
  return (
    category === AssetCategory.Forex || category === AssetCategory.Commodities
  );
};
export const Market: React.FC<{
  market: marketData;
}> = ({ market }) => {
  const { activeMarket } = useActiveMarket();
  const { navigateToMarket } = useFavouriteMarkets();
  const chartMarket = market.marketInfo;
  const readcallData = useBuyTradeData();

  const { currentPrice } = useCurrentPrice({
    token0: market.marketInfo.token0,
    token1: market.marketInfo.token1,
  });
  const isOpen =
    !market.isPaused &&
    isMarketOpen(
      market.category,
      readcallData?.creationWindows[getAddress(market.address)]
    );

  const { favouriteMarkets: favourites, removeFavouriteMarket } =
    useFavouriteMarkets();

  const isActive = useMemo(() => {
    if (activeMarket === undefined) return false;
    return (
      joinStrings(activeMarket?.token0, activeMarket?.token1, '') ===
      market.marketInfo.tv_id
    );
  }, [activeMarket, market]);

  const isFavourite = useMemo(() => {
    return favourites.find(
      (favourite) => chartMarket.tv_id === favourite.marketInfo.tv_id
    );
  }, [favourites, chartMarket]);

  function handleFavourite(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    removeFavouriteMarket(market);
  }

  const token0 = market.marketInfo.token0;
  const token1 = market.marketInfo.token1;

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
          <RowGap gap="4px">
            <div className="text-[#D34A4A] opacity-70"> CLOSED</div>
          </RowGap>
        )}
      </RowGap>
    </MarketBackground>
  );
};
