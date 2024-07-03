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
import { ColumnGap } from '@Views/ABTradePage/Components/Column';
import {
  RowBetween,
  RowGapItemsStretched,
} from '@Views/ABTradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/ABTradePage/Components/TextWrapper';
import { TradeSizeInput } from '@Views/ABTradePage/Views/BuyTrade/TradeSizeSelector/TradeSizeInput';
import {
  WalletBalance,
  formatBalance,
} from '@Views/ABTradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { MAX_APPROVAL_VALUE } from '@Views/ABTradePage/config';
import { getMaximumValue, getMinimumValue } from '@Views/ABTradePage/utils';
import { useNumberOfContracts } from '@Views/AboveBelow/Hooks/useNumberOfContracts';
import {
  readCallDataAtom,
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import {
  PlatfromFeeError,
  PlatfromFeeErrorOld,
} from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import { getAddress } from 'viem';
import { PoolDropdown } from './PoolDropDown';
import { useSettlementFee } from '@Views/AboveBelow/Hooks/useSettlementFee';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { useCurrentPrice } from '@Views/ABTradePage/Hooks/useCurrentPrice';
import { useIV } from '@Views/AboveBelow/Hooks/useIV';
import { getROI } from '../PriceTable';

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
  const { data: settlementFees } = useSettlementFee();
  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const { data: ivs } = useIV();

  const expiration = useAtomValue(selectedExpiry);
  const currentEpoch = Math.floor(Date.now() / 1000);

  if (activeMarket === undefined || readCallData === undefined) return <></>;
  const iv = ivs?.[activeMarket.tv_id];
  const token = activeMarket.poolInfo.token;
  console.log(`index-token: `, token, readCallData);
  const decimals = activeMarket.poolInfo.decimals;
  const balance =
    divide(readCallData.balances[token], decimals) ?? ('0' as string);

  let maxTradeSize = MAX_APPROVAL_VALUE;
  let maxPermissibleContracts: string | undefined = undefined;
  let settlementFee;
  let probability;
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
    let keySrring = selectedStrike[activeMarket.tv_id].isAbove
      ? 'sf_above'
      : 'sf_below';
    let marketKey =
      selectedStrike[activeMarket.tv_id].marketHash +
      '-' +
      getAddress(activeMarket.address);
    console.log(`index-marketKey: `, marketKey);
    const imobj = settlementFees[marketKey];
    console.log(`index-imobj: `, imobj);
    settlementFee = imobj?.[keySrring] ?? settlementFees['Base'];
    probability = BlackScholes(
      true,
      selectedStrike[activeMarket.tv_id].isAbove,
      currentPrice,
      selectedStrike[activeMarket.tv_id].price,
      Math.floor(expiration / 1000) - currentEpoch,
      0,
      iv / 1e4
    );
    if (maxPermissibleMarket !== undefined) {
      maxPermissibleContracts = maxPermissibleMarket.maxPermissibleContracts;
      if (maxPermissibleContracts !== undefined)
        maxTradeSize = multiply(
          divide(maxPermissibleContracts, decimals) as string,
          contracts.totalFee.toString()
        );
    }
  }
  // selectedStrike
  console.log(`index-selectedStrike: `, settlementFee, probability);
  let payout = '90';
  if (settlementFee && probability) {
    let totalFee = probability + (settlementFee / 1e4) * probability;
    console.log(`index-totalFee: `, totalFee);
    let roi = getROI(totalFee);
    payout = roi.substring(0, roi.length - 1);
  }
  console.log(`index-payout: `, payout);
  if (lt(maxTradeSize, '0')) maxTradeSize = '0';
  return (
    <TradeSizeSelectorBackground className="sm:!mt-[0px]">
      <ColumnGap gap="7px" className="w-full">
        <RowBetween>
          {/* {maxPermissibleContracts !== undefined ? (
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
          ) : ( */}
          <BuyTradeHeadText>Amount</BuyTradeHeadText>
          {/* )} */}

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
                            activeMarket.configContract.platformFee,
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
                  activeMarket.configContract.platformFee,
                  activeMarket.poolInfo.decimals
                ) as string
              }
              tradeToken={activeMarket.poolInfo.token}
              balance={balance}
              payout={payout}
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
  payout: string;
}> = ({
  balance,
  tradeSize,
  maxTradeSize,
  platfromFee,
  tradeToken,
  payout,
}) => {
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
      payout={payout}
      platfromFee={platfromFee}
      tradeToken={tradeToken}
      balance={balance}
      tradeSize={tradeSize}
    />
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
