import { ColumnGap } from '@Views/TradePage/Components/Column';
import {
  RowBetween,
  RowGap,
  RowGapItemsStretched,
} from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { WalletBalance, formatBalance } from './WalletBalance';
import { TradeSizeInput } from './TradeSizeInput';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { getMaximumValue } from '@Views/TradePage/utils';
import { PoolDropdown } from './PoolDropdown';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
`;

export const TradeSizeSelector: React.FC = () => {
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();

  if (!poolDetails || !readcallData || !switchPool) return <></>;

  const decimals = poolDetails.decimals;
  const balance = divide(readcallData.balance, decimals) as string;
  const tradeToken = poolDetails.token;
  const minFee = divide(switchPool.min_fee, decimals) as string;
  const maxFee = divide(switchPool.max_fee, decimals) as string;
  const maxTradeSize = getMaximumValue(balance || '0', maxFee);
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px">
        <RowBetween>
          <BuyTradeHeadText>Trade Size</BuyTradeHeadText>

          <WalletBalance balance={formatBalance(balance)} unit={tradeToken} />
        </RowBetween>
        <RowGapItemsStretched gap="0px">
          <TradeSizeInput maxTradeSize={maxTradeSize} tokenName={tradeToken} />
          <PoolDropdown />
        </RowGapItemsStretched>
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};
