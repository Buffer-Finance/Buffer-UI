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

import { toFixed } from '@Utils/NumString';
import { LightToolTipSVG } from '@Views/TradePage/Components/LightToolTipSVG';

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
  const minFee = divide(switchPool.min_fee || '0', decimals) as string;
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
          </RowGap>

          <WalletBalance
            balance={formatBalance(toFixed(balance, 2))}
            unit={tradeToken}
          />
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
        <RowGap gap="4px" className="text-[#7F87A7] text-f10">
          <LightToolTipSVG />
          {divide(switchPool.platformFee, decimals)} {tradeToken} will be
          charged as platform fee.
        </RowGap>
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};
