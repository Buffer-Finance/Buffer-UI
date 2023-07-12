import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { getPayout, joinStrings } from '@Views/TradePage/utils';
import { isObjectEmpty } from '@Views/TradePage/utils/isObjectEmpty';

export const BasePayout: React.FC<{
  token0: string;
  token1: string;
}> = ({ token0, token1 }) => {
  const { data: baseSettlementFees } = useSettlementFee();
  const baseSettlementFee =
    baseSettlementFees?.[joinStrings(token0, token1, '')]?.settlement_fee;

  if (baseSettlementFee === undefined || baseSettlementFee === null)
    return <div>fetching...</div>;
  const payout = getPayout(baseSettlementFee.toString());

  return <div>{payout}%</div>;
};

export const Payout: React.FC<{
  token0: string;
  token1: string;
}> = ({ token0, token1 }) => {
  const { payout } = useSelectedAssetPayout({ token0, token1 });
  if (payout === undefined || payout === null) {
    return <div>fetching...</div>;
  }
  return <div>{payout}%</div>;
};

export const useSelectedAssetPayout = ({
  token0,
  token1,
}: {
  token0: string | undefined;
  token1: string | undefined;
}) => {
  const readcallData = useBuyTradeData();
  const { switchPool } = useSwitchPool();
  const { data: baseSettlementFees } = useSettlementFee();

  let payout = null;

  if (
    readcallData &&
    !isObjectEmpty(readcallData.settlementFees) &&
    switchPool
  ) {
    payout = readcallData.settlementFees[switchPool?.optionContract];
  }
  if (payout === null) {
    if (token0 !== undefined && token1 !== undefined) {
      const baseSettlementFee =
        baseSettlementFees?.[joinStrings(token0, token1, '')]?.settlement_fee;

      if (baseSettlementFee) {
        payout = getPayout(baseSettlementFee.toString());
      }
    }
  }

  if (payout === null) {
    console.log(
      'payoutFetchingError:',
      readcallData,
      switchPool,
      baseSettlementFees
    );
  }
  return { payout };
};
