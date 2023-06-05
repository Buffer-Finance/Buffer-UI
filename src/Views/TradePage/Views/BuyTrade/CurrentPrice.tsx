import { toFixed } from '@Utils/NumString';
import { setDoccumentTitle } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import { RowBetween } from '@Views/TradePage/Components/Row';
import {
  BuyTradeDescText,
  BuyTradeHeadText,
} from '@Views/TradePage/Components/TextWrapper';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { marketsForChart } from '@Views/TradePage/config';
import { joinStrings } from '@Views/V3App/helperFns';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';

export const CurrentPriceBackground = styled.div`
  margin-top: 7px;
`;

export const CurrentPrice: React.FC<{
  price: string;
}> = ({ price }) => {
  const { activeMarket } = useActiveMarket();

  const chartMarket =
    marketsForChart[
      joinStrings(
        activeMarket?.token0 ?? '',
        activeMarket?.token1 ?? '',
        ''
      ) as keyof typeof marketsForChart
    ];
  const precisePrice = toFixed(
    price,
    chartMarket.price_precision.toString().length - 1
  );
  const title = price ? precisePrice + ' | ' + chartMarket.tv_id : '';
  setDoccumentTitle(title);
  return (
    <CurrentPriceBackground>
      <RowBetween>
        <BuyTradeHeadText>
          <Trans>Price</Trans>
        </BuyTradeHeadText>
        <BuyTradeDescText>{precisePrice}</BuyTradeDescText>
      </RowBetween>
    </CurrentPriceBackground>
  );
};
