import { RowBetween } from '@Views/TradePage/Components/Row';
import {
  BuyTradeDescText,
  BuyTradeHeadText,
} from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';

export const CurrentPriceBackground = styled.div`
  margin-top: 7px;
`;

export const CurrentPrice: React.FC<{ price: string }> = ({ price }) => {
  return (
    <CurrentPriceBackground>
      <RowBetween>
        <BuyTradeHeadText>
          <Trans>Price</Trans>
        </BuyTradeHeadText>
        <BuyTradeDescText>{price}</BuyTradeDescText>
      </RowBetween>
    </CurrentPriceBackground>
  );
};
