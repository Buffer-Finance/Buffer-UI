import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import {
  add,
  divide,
  gt,
  gte,
  lt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { useNumberOfContracts } from '@Views/AboveBelow/Hooks/useNumberOfContracts';
import {
  readCallDataAtom,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
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
import { MAX_APPROVAL_VALUE } from '@Views/TradePage/config';
import { getMaximumValue, getMinimumValue } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import { getAddress } from 'viem';
import { PoolDropdown } from './PoolDropDown';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 16px;
  width: 100%;
`;

export const TradeSize: React.FC<{
  onSubmit?: any;
}> = ({ onSubmit }) => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const [tradeSize, setTradeSize] = useAtom(tradeSizeAtom);
  const readCallData = useAtomValue(readCallDataAtom);
  const selectedStrike = useAtomValue(selectedPriceAtom);
  const { address: userAddress } = useUserAccount();
  const contracts = useNumberOfContracts();

  if (activeMarket === undefined || readCallData === undefined) return <></>;
  const token = activeMarket.poolInfo.token.toUpperCase();
  const decimals = activeMarket.poolInfo.decimals;
  const balance =
    divide(readCallData.balances[token], decimals) ?? ('0' as string);

  let maxTradeSize = MAX_APPROVAL_VALUE;
  let maxPermissibleContracts: string | undefined = undefined;
  if (
    contracts &&
    selectedStrike !== undefined &&
    selectedStrike[activeMarket.tv_id] !== undefined
  ) {
    const { strike } = contracts.selectedStrikeData;
    const maxPermissibleMarket =
      readCallData.maxPermissibleContracts[
        getAddress(activeMarket.address) + strike
      ];
    if (maxPermissibleMarket !== undefined) {
      maxPermissibleContracts = maxPermissibleMarket.maxPermissibleContracts;
      if (maxPermissibleContracts !== undefined)
        maxTradeSize = multiply(
          divide(maxPermissibleContracts, decimals) as string,
          contracts.totalFee.toString()
        );
    }
  }
  if (lt(maxTradeSize, '0')) maxTradeSize = '0';
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px" className="w-full">
        <RowBetween>
          {maxPermissibleContracts !== undefined ? (
            <span className="text-[#7F87A7] items-center text-f12 flex">
              Max Amount&nbsp;:&nbsp;
              {toFixed(maxTradeSize, 2)}&nbsp;(
              {toFixed(
                divide(maxPermissibleContracts ?? '0', decimals) as string,
                2
              )}
              &nbsp;
              {selectedStrike?.[activeMarket.tv_id]?.isAbove ? 'Up' : 'Down'})
            </span>
          ) : (
            <BuyTradeHeadText>Amount</BuyTradeHeadText>
          )}

          <WalletBalance
            balance={formatBalance(toFixed(balance, 2))}
            unit={token}
          />
        </RowBetween>
        <ColumnGap gap="0px" className="mb-3">
          <RowGapItemsStretched gap="0px" className="w-full relative">
            <TradeSizeInput
              maxTradeSize="0"
              minTradeSize="0"
              tradeSize={tradeSize}
              setTradeSize={setTradeSize}
              onSubmit={onSubmit}
              setMaxValue={() => {
                setTradeSize(
                  toFixed(
                    getMaximumValue(
                      getMinimumValue(
                        subtract(
                          balance,
                          divide(
                            activeMarket.config.platformFee,
                            activeMarket.poolInfo.decimals
                          ) as string
                        ),
                        maxTradeSize
                      ),
                      '0'
                    ),
                    2
                  )
                );
              }}
            />

            <PoolDropdown />
          </RowGapItemsStretched>

          {userAddress && (
            <Error
              platfromFee={
                divide(
                  activeMarket.config.platformFee,
                  activeMarket.poolInfo.decimals
                ) as string
              }
              tradeToken={activeMarket.poolInfo.token}
              balance={balance}
              tradeSize={tradeSize}
              maxTradeSize={maxTradeSize}
            />
          )}
        </ColumnGap>
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};
const Error: React.FC<{
  balance: string;
  tradeSize: string;
  maxTradeSize: string;
  tradeToken: string;
  platfromFee: string;
}> = ({ balance, tradeSize, maxTradeSize, platfromFee, tradeToken }) => {
  const error = getTradeSizeError(
    // minTradeSize,
    maxTradeSize,
    balance,
    tradeSize
  );
  return error ? (
    <span className="text-red whitespace-nowrap text-f12">{error}</span>
  ) : (
    <PlatfromFeeError
      platfromFee={platfromFee}
      tradeToken={tradeToken}
      balance={balance}
    />
  );
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
            Platform fee : + {toFixed(platfromFee, 3)} {tradeToken}
          </>
        )
      )}
    </RowGap>
  );
};

export function getTradeSizeError(
  // minTradeSize: string,
  maxTradeSize: string,
  balance: string | undefined,
  tradeSize: string
) {
  const minTradeSize = '0';
  let error = '';
  if (lt(tradeSize || '0', '0')) {
    error = `Trade size must be higher than ${minTradeSize}`;
  } else if (gt(tradeSize || '0', maxTradeSize)) {
    error = `Max trade size is ${toFixed(maxTradeSize, 2)}`;
  } else if (balance && gt(tradeSize || '0', balance)) {
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
