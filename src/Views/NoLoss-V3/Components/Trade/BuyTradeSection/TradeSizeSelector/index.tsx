import { toFixed } from '@Utils/NumString';
import {
  divide,
  gt,
  gte,
  lt,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import {
  noLossReadCallsReadOnlyAtom,
  noLossTradeSizeAtom,
} from '@Views/NoLoss-V3/atoms';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import {
  RowBetween,
  RowGap,
  RowGapItemsStretched,
} from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { getMaximumValue, getMinimumValue } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { TradeSizeInput } from './TradeSizeInput';
import { WalletBalance, formatBalance } from './WalletBalance';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const TradeSizeSelector: React.FC<{
  onSubmit?: any;
  activeMarket: InoLossMarket;
}> = ({ onSubmit, activeMarket }) => {
  const [tradeSize, setTradeSize] = useAtom(noLossTradeSizeAtom);
  const decimals = 18;
  const minFee = divide(activeMarket.config.minFee, decimals) as string;
  const maxFee = divide(activeMarket.config.maxFee, decimals) as string;
  const { result: readCallResults } = useAtomValue(noLossReadCallsReadOnlyAtom);
  const balance = readCallResults?.activeTournamentBalance;
  const error = getTradeSizeError(minFee, maxFee, balance, tradeSize);

  const setMaxValue = useCallback(
    () =>
      setTradeSize(
        getMaximumValue(
          toFixed(
            getMinimumValue(
              subtract(maxFee, '1'),
              divide(balance ?? '0', 18) as string
            ),
            2
          ),
          '0'
        )
      ),
    [maxFee, balance]
  );

  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px" className="w-full">
        <RowBetween>
          <RowGap gap="4px">
            <BuyTradeHeadText>Trade Size</BuyTradeHeadText>
          </RowGap>

          <WalletBalance
            balance={formatBalance(divide(balance ?? '0', 18) as string)}
            unit={''}
          />
        </RowBetween>
        <RowGapItemsStretched gap="0px" className="w-full">
          <TradeSizeInput
            maxTradeSize={maxFee}
            minTradeSize={minFee}
            onSubmit={onSubmit}
            setMaxValue={setMaxValue}
            setTradeSize={setTradeSize}
            tradeSize={tradeSize}
          />

          {/* <PoolDropdown /> */}
        </RowGapItemsStretched>
        <span className="text-red whitespace-nowrap">{error}</span>
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};

export function getTradeSizeError(
  minTradeSize: string,
  maxTradeSize: string,
  balanceWithDecimals: string | undefined,
  tradeSize: string
) {
  let error = '';
  if (lt(tradeSize || '0', minTradeSize)) {
    error = `Min trade size is ${minTradeSize}`;
  } else if (gte(tradeSize || '0', maxTradeSize)) {
    error = `Max trade size is ${maxTradeSize}`;
  } else if (
    balanceWithDecimals &&
    gt(tradeSize || '0', divide(balanceWithDecimals, 18) as string)
  ) {
    error = 'Insufficient balance';
  }

  return error;
}
