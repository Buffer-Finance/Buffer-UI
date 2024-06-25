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

  return <div className="b1200:text-center">{payout}x</div>;
};

export const useSelectedAssetPayout = () => {
  const readcallData = useAtomValue(buyTradeDataAtom);
  const { data: baseSettlementFees } = useSettlementFee();

  const calculatePayout = useCallback(
    (assetName: string | undefined, optionContract: string) => {
      if (assetName === undefined) return { payout: null };
      let payout = null;

      if (readcallData && !isObjectEmpty(readcallData.settlementFees)) {
        payout = readcallData.settlementFees[getAddress(optionContract)];
      }
      if (payout === null) {
        const baseSettlementFee =
          baseSettlementFees?.[assetName]?.settlement_fee;

        if (baseSettlementFee) {
          payout = getPayout(baseSettlementFee.toString());
        }
      }

      return { payout };
    },
    [readcallData, baseSettlementFees]
  );

  return { calculatePayout };
};
