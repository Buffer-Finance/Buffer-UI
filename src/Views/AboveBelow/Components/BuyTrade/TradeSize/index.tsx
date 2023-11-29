import { toFixed } from '@Utils/NumString';
import { add, gt } from '@Utils/NumString/stringArithmatics';
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
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { TradeSizeInput } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/TradeSizeInput';
import {
  WalletBalance,
  formatBalance,
} from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const TradeSize: React.FC<{
  onSubmit?: any;
}> = ({ onSubmit }) => {
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px" className="w-full">
        <RowBetween>
          <RowGap gap="4px">
            <BuyTradeHeadText>Amount</BuyTradeHeadText>
          </RowGap>

          <WalletBalance
            balance={formatBalance(toFixed('0', 2))}
            unit={'ARB'}
          />
        </RowBetween>
        <RowGapItemsStretched gap="0px" className="w-full">
          <TradeSizeInput
            maxTradeSize={'0'}
            registeredOneCT={true}
            tokenName={'ARB'}
            balance={'0'}
            platformFee={'0.1'}
            minTradeSize={'0'}
            onSubmit={onSubmit}
          />

          <PoolDropdown />
        </RowGapItemsStretched>
        <PlatfromFeeError
          platfromFee={'0.1'}
          tradeToken={'ARB'}
          balance={'0'}
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
