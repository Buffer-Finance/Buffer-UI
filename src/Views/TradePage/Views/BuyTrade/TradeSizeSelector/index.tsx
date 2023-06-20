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
import { add, divide } from '@Utils/NumString/stringArithmatics';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { PoolDropdown } from './PoolDropdown';
import { IconToolTip } from '@Views/TradePage/Components/IconToolTip';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const TradeSizeSelector: React.FC = () => {
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();

  if (!poolDetails || !readcallData || !switchPool) return <></>;

  const decimals = poolDetails.decimals;
  const balance = divide(readcallData.balance ?? 0, decimals) as string;
  const tradeToken = poolDetails.token;
  const minFee = divide(
    add(switchPool.min_fee || '0', switchPool.platformFee || '0'),
    decimals
  ) as string;
  const maxFee = divide(
    readcallData.maxTradeSizes[switchPool.optionContract] ?? '0',
    decimals
  ) as string;
  const maxTradeSize = maxFee;
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px">
        <RowBetween>
          <RowGap gap="4px">
            <BuyTradeHeadText>Trade Size</BuyTradeHeadText>
            <IconToolTip
              content={
                <>
                  {divide(switchPool.platformFee, decimals)} {tradeToken} will
                  be charged as platform fee.
                </>
              }
            />
          </RowGap>

          <WalletBalance balance={formatBalance(balance)} unit={tradeToken} />
        </RowBetween>
        <RowGapItemsStretched gap="0px">
          <TradeSizeInput
            maxTradeSize={maxTradeSize}
            tokenName={tradeToken}
            balance={balance}
            minTradeSize={minFee}
          />
          <PoolDropdown />
        </RowGapItemsStretched>
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};
