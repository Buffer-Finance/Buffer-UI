import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { WalletBalance, formatBalance } from './WalletBalance';
import { TradeSizeInput } from './TradeSizeInput';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
`;

export const TradeSizeSelector: React.FC = () => {
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px">
        <RowBetween>
          <BuyTradeHeadText>Trade Size</BuyTradeHeadText>

          <WalletBalance balance={formatBalance('-5345')} unit="ETH" />
        </RowBetween>
        <TradeSizeInput />
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};
