import { toFixed } from '@Utils/NumString';
import { add, divide, gt } from '@Utils/NumString/stringArithmatics';
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
  RowGapItemsTop,
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
      </ColumnGap>
    </TradeSizeSelectorBackground>
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
  const notEnoughForTrade = gt(tradeSize || '0', balance);
  const notEnooghForFee = gt(add(tradeSize || '0', platfromFee), balance);
  const isError = notEnooghForFee;
  if (notEnooghForFee && notEnoughForTrade) return <></>;
  return (
    <RowGapItemsTop
      gap="4px"
      className={`text-${isError ? 'red' : '[#7F87A7]'} text-f10`}
    >
      <LightToolTipSVG className="mt-[3px]" />
      {isError ? (
        <>
          Insufficient funds for platform fee.{' '}
          <BuyUSDCLink token={tradeToken as 'ARB'} />
        </>
      ) : (
        !isError && (
          <>
            Platform fee : + {platfromFee} {tradeToken}
          </>
        )
      )}
    </RowGapItemsTop>
  );
};
