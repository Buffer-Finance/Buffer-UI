import Star from '@Public/ComponentSVGS/Star';
import { round } from '@Utils/NumString/stringArithmatics';
import { navigateToarket } from '@Views/AboveBelow/Helpers/navigateToMarket';
import { useIsInCreationWindow } from '@Views/AboveBelow/Hooks/useIsInCreationWIndow';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import {
  favouriteMarketsAtom,
  selectedPoolActiveMarketAtom,
} from '@Views/AboveBelow/atoms';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { PairTokenImage } from '@Views/ABTradePage/Views/PairTokenImage';
import { joinStrings } from '@Views/ABTradePage/utils';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const Market: React.FC<{
  market: marketTypeAB;
}> = ({ market }) => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const { price, precision } = useMarketPrice(market.tv_id);
  const navigate = useNavigate();

  const setFavouriteMarket = useSetAtom(favouriteMarketsAtom);
  const isIncreationWindow = useIsInCreationWindow();
  const setActiveMarket = (token0: string, token1: string) => {
    navigateToarket(navigate, token0 + '-' + token1, '/above-below');
  };
  // const isIncreationWindow = {
  //   crypto: true,
  //   forex: true,
  //   commodity: true,
  // };
  const isOpen =
    !market.isPaused &&
    isIncreationWindow[
      market.category.toLowerCase() as 'crypto' | 'forex' | 'commodity'
    ];

  const isActive = useMemo(() => {
    if (activeMarket === undefined) return false;
    return activeMarket.tv_id === market.tv_id;
  }, [activeMarket, market]);

  function handleFavourite(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    setFavouriteMarket((favMarkets) =>
      favMarkets.filter((favMarket) => favMarket !== market.tv_id)
    );
  }

  const token0 = market.token0;
  const token1 = market.token1;

  function handleMarketClick() {
    setActiveMarket(market.token0, market.token1);
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
        {isOpen === undefined ? (
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
