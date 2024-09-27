import { add, divide } from '@Utils/NumString/stringArithmatics';
import { buyTradeDataAtom } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { getPayout, joinStrings } from '@Views/TradePage/utils';
import { isObjectEmpty } from '@Views/TradePage/utils/isObjectEmpty';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { getAddress } from 'viem';

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
  optionContract: string;
}> = ({ token0, token1, optionContract }) => {
  const { calculatePayout } = useSelectedAssetPayout();
  let { payout } = calculatePayout(
    joinStrings(token0, token1, ''),
    optionContract
  );
  if (payout === undefined || payout === null) {
    return <Skeleton className="w-[30px] !h-5 lc " />;
  }
  payout = payout ? divide(add(payout, '100'), '100') : '0';

  return (
    <div
      className="b1200:text-center"
      title={
        'Multiplier is dependent on direction of trade. ' +
        payout +
        'x is maximum payout we offer from both the directions'
      }
    >
      {payout}x <span className="text-2">(max)</span>
    </div>
  );
};

export const useSelectedAssetPayout = () => {
  const readcallData = useAtomValue(buyTradeDataAtom);
  const { data: baseSettlementFees } = useSettlementFee();

  const calculatePayout = useCallback(
    (assetName: string | undefined, optionContract: string) => {
      let baseSettlementFee;
      let payout = null;
      if (baseSettlementFees) {
        baseSettlementFee = Math.max(
          baseSettlementFees['up'].settlement_fee,
          baseSettlementFees['down'].settlement_fee
        );
      }

      if (baseSettlementFee) {
        payout = getPayout(baseSettlementFee.toString());
      }

      return { payout };
    },
    [baseSettlementFees]
  );

  return { calculatePayout };
};
