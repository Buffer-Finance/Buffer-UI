import { toFixed } from '@Utils/NumString';
import {
  add,
  divide,
  gt,
  gte,
  lt,
  lte,
} from '@Utils/NumString/stringArithmatics';
import { useNumberOfContracts } from '@Views/AboveBelow/Hooks/useNumberOfContracts';
import {
  readCallDataAtom,
  selectedPoolActiveMarketAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { LightToolTipSVG } from '@Views/TradePage/Components/LightToolTipSVG';
import {
  RowBetween,
  RowGap,
  RowGapItemsStretched,
} from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { BuyUSDCLink } from '@Views/TradePage/Views/BuyTrade/BuyUsdcLink';
import { TradeSizeInput } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/TradeSizeInput';
import {
  WalletBalance,
  formatBalance,
} from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import { PoolDropdown } from './PoolDropDown';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const TradeSize: React.FC<{
  onSubmit?: any;
}> = ({ onSubmit }) => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const [tradeSize, setTradeSize] = useAtom(tradeSizeAtom);
  const readCallData = useAtomValue(readCallDataAtom);

  if (activeMarket === undefined || readCallData === undefined) return <></>;
  const token = activeMarket.poolInfo.token.toUpperCase();
  const decimals = activeMarket.poolInfo.decimals;
  const balance =
    divide(readCallData.balances[token], decimals) ?? ('0' as string);
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px" className="w-full">
        <RowBetween>
          <RowGap gap="4px">
            <BuyTradeHeadText>Amount</BuyTradeHeadText>
          </RowGap>

          <WalletBalance
            balance={formatBalance(toFixed(balance, 2))}
            unit={token}
          />
        </RowBetween>
        <RowGapItemsStretched gap="0px" className="w-full">
          <TradeSizeInput
            maxTradeSize="0"
            minTradeSize="0"
            tradeSize={tradeSize}
            setTradeSize={setTradeSize}
            onSubmit={onSubmit}
            setMaxValue={() => {
              setTradeSize('0');
            }}
          />

          <PoolDropdown />
        </RowGapItemsStretched>
        <PlatfromFeeError
          platfromFee={
            divide(
              activeMarket.config.platformFee,
              activeMarket.poolInfo.decimals
            ) as string
          }
          tradeToken={activeMarket.poolInfo.token}
          balance={balance}
        />
        <Error balance={balance} tradeSize={tradeSize} />
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};
const Error: React.FC<{ balance: string; tradeSize: string }> = ({
  balance,
  tradeSize,
}) => {
  const contracts = useNumberOfContracts();
  const minTradeSize = contracts === null ? '0' : contracts.totalFee.toFixed(2);
  const error = getTradeSizeError(minTradeSize, balance, tradeSize);
  return <span className="text-red whitespace-nowrap text-f12">{error}</span>;
};

const PlatfromFeeError = ({
  platfromFee,
  tradeToken,
  balance,
}: {
  platfromFee: string;
  tradeToken: string;
  balance: string;
}) => {
  const tradeSize = useAtomValue(tradeSizeAtom);
  const error = getPlatformError({
    platfromFee,
    tradeSize: tradeSize || '0',
    balance,
  });

  return (
    <RowGap
      gap="4px"
      className={`text-${error ? 'red' : '[#7F87A7]'} items-center text-f12`}
    >
      <LightToolTipSVG className="mt-[3px]" />
      {error ? (
        <>
          {error} <BuyUSDCLink token={tradeToken as 'ARB'} />
        </>
      ) : (
        !error && (
          <>
            Platform fee : + {platfromFee} {tradeToken}
          </>
        )
      )}
    </RowGap>
  );
};

export function getTradeSizeError(
  minTradeSize: string,
  // maxTradeSize: string,
  balance: string | undefined,
  tradeSize: string
) {
  let error = '';
  if (lte(tradeSize || '0', minTradeSize)) {
    error = `Trade size must be higher than ${minTradeSize}`;
  }
  // else if (gt(tradeSize || '0', maxTradeSize)) {
  //   error = `Max trade size is ${toFixed(maxTradeSize, 2)}`;
  // }
  else if (balance && gt(tradeSize || '0', balance)) {
    error = 'Insufficient balance';
  }

  return error;
}

export function getPlatformError({
  platfromFee,
  tradeSize,
  balance,
}: {
  platfromFee: string;
  balance: string;
  tradeSize: string;
}) {
  let error = '';

  if (
    gte(balance, tradeSize || '0') &&
    lt(balance, add(tradeSize || '0', platfromFee))
  ) {
    error = 'Insufficient funds for platform fee.';
  }
  return error;
}
