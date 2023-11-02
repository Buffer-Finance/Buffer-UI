import Star from '@Public/ComponentSVGS/Star';
import { round } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import { useUpdateActiveMarket } from '@Views/NoLoss-V3/Hooks/useUpdateActiveMarket';
import {
  activeMarketIdAtom,
  noLossFavouriteMarketsAtom,
} from '@Views/NoLoss-V3/atoms';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { RowGap } from '@Views/TradePage/Components/Row';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { AssetCategory } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

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
  market: InoLossMarket;
}> = ({ market }) => {
  const activeMarketId = useAtomValue(activeMarketIdAtom);
  const { price, precision } = useMarketPrice(market.chartData.tv_id);
  const { setActiveMarket } = useUpdateActiveMarket();
  const setFavouriteMarket = useSetAtom(noLossFavouriteMarketsAtom);
  const isReadCallDataLoading = false;
  const isOpen = !market.isPaused;

  const isActive = useMemo(() => {
    if (activeMarketId === undefined) return false;
    return activeMarketId === market.chartData.tv_id;
  }, [activeMarketId, market]);

  function handleFavourite(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    setFavouriteMarket((favMarkets) =>
      favMarkets.filter((favMarket) => favMarket !== market.chartData.tv_id)
    );
  }

  const token0 = market.chartData.token0;
  const token1 = market.chartData.token1;

  function handleMarketClick() {
    setActiveMarket(market.chartData.pair);
  }

  return (
    <MarketBackground isActive={isActive} onClick={handleMarketClick}>
      <RowGap gap="6px">
        <div type="button" onClick={handleFavourite} className="!p-2">
          <Star active={true} />
        </div>
        <div className="h-[16px] w-[16px]">
          <PairTokenImage pair={joinStrings(token0, token1, '-')} />
        </div>
        {token0}/{token1}
        {isReadCallDataLoading ? (
          <Skeleton className="w-[60px] !h-[20px] lc " />
        ) : isOpen ? (
          !price ? (
            <Skeleton className="w-[60px] !h-[20px] lc " />
          ) : (
            <Display
              data={round(price, precision)}
              colored
              precision={precision}
            />
          )
        ) : (
          <RowGap gap="4px">
            <div className="text-[#D34A4A] opacity-70"> CLOSED</div>
          </RowGap>
        )}
      </RowGap>
    </MarketBackground>
  );
};
