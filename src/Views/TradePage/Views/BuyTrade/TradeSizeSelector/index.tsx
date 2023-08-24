import { ColumnGap } from '@Views/TradePage/Components/Column';
import {
  RowBetween,
  RowGap,
  RowGapItemsStretched,
  RowGapItemsTop,
} from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { WalletBalance, formatBalance } from './WalletBalance';
import { TradeSizeInput } from './TradeSizeInput';
import { add, divide, gt } from '@Utils/NumString/stringArithmatics';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { PoolDropdown } from './PoolDropdown';
import { toFixed } from '@Utils/NumString';
import { LightToolTipSVG } from '@Views/TradePage/Components/LightToolTipSVG';
import { useAtomValue } from 'jotai';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { useAccount } from 'wagmi';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { BuyUSDCLink } from '../BuyUsdcLink';

const TradeSizeSelectorBackground = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const TradeSizeSelector: React.FC<{
  onSubmit?: any;
}> = ({ onSubmit }) => {
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();
  const { registeredOneCT } = useOneCTWallet();

  if (!poolDetails || !readcallData || !switchPool) return <></>;

  const decimals = poolDetails.decimals;
  const balance = divide(readcallData.balance ?? 0, decimals) as string;
  const tradeToken = poolDetails.token;
  const minFee = divide(switchPool.min_fee || '0', decimals) as string;
  const maxFee = divide(
    readcallData.maxTradeSizes[switchPool.optionContract] ?? '0',
    decimals
  ) as string;
  const platformFee = divide(switchPool.platformFee, decimals) as string;
  const maxTradeSize = maxFee;
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px" className="w-full">
        <RowBetween>
          <RowGap gap="4px">
            <BuyTradeHeadText>Trade Size</BuyTradeHeadText>
          </RowGap>

          <WalletBalance
            balance={formatBalance(toFixed(balance, 2))}
            unit={tradeToken}
          />
        </RowBetween>
        <RowGapItemsStretched gap="0px" className="w-full">
          <TradeSizeInput
            maxTradeSize={maxTradeSize}
            registeredOneCT={!!registeredOneCT}
            tokenName={tradeToken}
            balance={balance}
            platformFee={platformFee}
            minTradeSize={minFee}
            onSubmit={onSubmit}
          />

          <PoolDropdown />
        </RowGapItemsStretched>
        {registeredOneCT && (
          <PlatfromFeeError
            platfromFee={platformFee}
            tradeToken={tradeToken}
            balance={balance}
          />
        )}
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
            Additional {platfromFee} {tradeToken} will be charged as platform
            fee.
          </>
        )
      )}
    </RowGapItemsTop>
  );
};
