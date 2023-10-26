import { toFixed } from '@Utils/NumString';
import { add, divide, gt } from '@Utils/NumString/stringArithmatics';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { LightToolTipSVG } from '@Views/TradePage/Components/LightToolTipSVG';
import {
  RowBetween,
  RowGap,
  RowGapItemsStretched,
  RowGapItemsTop,
} from '@Views/TradePage/Components/Row';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { buyTradeDataAtom } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { BuyUSDCLink } from '../BuyUsdcLink';
import { PoolDropdown } from './PoolDropdown';
import { TradeSizeInput } from './TradeSizeInput';
import { WalletBalance, formatBalance } from './WalletBalance';

const TradeSizeSelectorBackground = styled.div`
  width: 100%;
`;

export const PerpsInput: React.FC<{
  onSubmit?: any;
}> = ({ onSubmit }) => {
  const { registeredOneCT } = useOneCTWallet();
  const balance = '23412234';
  const tradeToken = 'USDC';
  const minFee = '2';
  const platformFee = '1233';
  const maxTradeSize = '122220';
  return (
    <TradeSizeSelectorBackground>
      <ColumnGap gap="7px" className="w-full">
        <RowGapItemsStretched gap="0px" className="w-full">
          <TradeSizeInput
            maxTradeSize={maxTradeSize}
            registeredOneCT={!!registeredOneCT}
            tokenName={tradeToken}
            balance={balance}
            platformFee={platformFee}
            minTradeSize={minFee}
            onSubmit={onSubmit}
            className={'!h-[33px]'}
          />

          <div className="!bg-[#303044] rounded-r-[5px] py-2 text-f14 text-1 px-3 font-medium h-[33px] ">
            BTC
          </div>
        </RowGapItemsStretched>
      </ColumnGap>
    </TradeSizeSelectorBackground>
  );
};

export const PlatfromFeeError = ({
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
