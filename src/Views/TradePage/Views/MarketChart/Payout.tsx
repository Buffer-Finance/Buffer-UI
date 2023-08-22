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
  const { calculatePayout } = useSelectedAssetPayout();
  const { payout } = calculatePayout(joinStrings(token0, token1, ''));
  if (payout === undefined || payout === null) {
    return <div>fetching...</div>;
  }
  return <div className="b1200:text-center">{payout}%</div>;
};

export const useSelectedAssetPayout = () => {
  const readcallData = useBuyTradeData();

  const { switchPool } = useSwitchPool();
  const { data: baseSettlementFees } = useSettlementFee();

  const calculatePayout = (assetName: string | undefined) => {
    if (assetName === undefined) return { payout: null };
    let payout = null;

    if (
      readcallData &&
      !isObjectEmpty(readcallData.settlementFees) &&
      switchPool
    ) {
      payout = readcallData.settlementFees[switchPool?.optionContract];
    }
    if (payout === null) {
      const baseSettlementFee = baseSettlementFees?.[assetName]?.settlement_fee;

      if (baseSettlementFee) {
        payout = getPayout(baseSettlementFee.toString());
      }
    }

    return { payout };
  };

  return { calculatePayout };
};
