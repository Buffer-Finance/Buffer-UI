import { activeMarketDataAtom } from '@Views/NoLoss-V3/atoms';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { BuyButtons } from './BuyButtons';
import { CurrentPrice } from './CurrentPrice';
import { PayoutProfit } from './PayoutProfit';
import { TimeSelector } from './TimeSelector';
import { TradeSizeSelector } from './TradeSizeSelector';

export const BuyTradeSection = () => {
  const activeMarket = useAtomValue(activeMarketDataAtom);
  if (activeMarket === undefined)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-[310px] !h-[380px] lc !rounded-md mx-2 mt-3 "
      />
    );
  return (
    <BuyTradeSectionBackground>
      <TimeSelector activeMarket={activeMarket} />
      <TradeSizeSelector activeMarket={activeMarket} />
      <CurrentPrice activeMarket={activeMarket} />
      <PayoutProfit activeMarket={activeMarket} />
      <BuyButtons activeMarket={activeMarket} />
    </BuyTradeSectionBackground>
  );
};

const BuyTradeSectionBackground = styled.div`
  position: sticky;
  top: 45px;
  max-width: 275px;
  background-color: #1c1c28;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: calc(100vh - 80px);
`;
