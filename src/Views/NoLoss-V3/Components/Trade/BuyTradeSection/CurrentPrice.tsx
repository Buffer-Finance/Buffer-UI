import { round } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { RowBetween } from '@Views/TradePage/Components/Row';
import {
  BuyTradeDescText,
  BuyTradeHeadText,
} from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Skeleton } from '@mui/material';

export const CurrentPriceBackground = styled.div`
  margin-top: 7px;
`;

export const CurrentPrice: React.FC<{
  activeMarket: InoLossMarket;
}> = ({ activeMarket }) => {
  const { price, precision } = useMarketPrice(activeMarket.chartData.tv_id);
  return (
    <>
      <CurrentPriceBackground>
        <RowBetween>
          <BuyTradeHeadText>
            <Trans>Price</Trans>
          </BuyTradeHeadText>
          <BuyTradeDescText>
            {!price ? (
              <Skeleton className="w-[80px] !h-[26px] lc !transform-none" />
            ) : (
              <Display
                data={round(price, precision)}
                precision={precision}
                className="!py-[1px]"
              />
            )}
          </BuyTradeDescText>
        </RowBetween>
      </CurrentPriceBackground>
    </>
  );
};
