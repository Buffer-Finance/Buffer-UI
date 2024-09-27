import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import useSWR from 'swr';
import { UDProductID, baseUrl } from '../config';
import { useProducts } from '@Views/AboveBelow/Hooks/useProductName';
import { dsc } from '@ConfigContract';
import { useActiveMarket } from './useActiveMarket';
import { joinStrings } from '../utils';
import { useAtomValue } from 'jotai';
import { timeSelectorAtom } from '../atoms';

interface SettlementFee {
  settlement_fee: number;
  settlement_fee_sign_expiration: number;
  settlement_fee_signature: string;
  period: number;
  isAbove: boolean;
}
export interface IBaseSettlementFees {
  up: SettlementFee;
  down: SettlementFee;
}

export const useSettlementFee = () => {
  const { activeChain } = useActiveChain();
  const { activeMarket } = useActiveMarket();
  const currentTime = useAtomValue(timeSelectorAtom);
  console.log(`currentTime: `, currentTime);

  const products = useProducts();
  return useSWR<IBaseSettlementFees>(
    [activeChain, 'settlementFee', currentTime?.seconds],
    {
      fetcher: () => ({
        up: {
          settlement_fee: 1250,
          settlement_fee_sign_expiration: 1727440999,
          settlement_fee_signature:
            '0x9de65dc09f00a3e343db1dbd90c04fa7f40a78cb0f1210b78cd7847a996e0d2c6b5e0df80ff66824ec3dabc511d32868b05f401972dc00e1a730f0d5a50c91171c',
          period: 15,
          isAbove: true,
        },
        down: {
          settlement_fee: 1250,
          settlement_fee_sign_expiration: 1727440999,
          settlement_fee_signature:
            '0x9de65dc09f00a3e343db1dbd90c04fa7f40a78cb0f1210b78cd7847a996e0d2c6b5e0df80ff66824ec3dabc511d32868b05f401972dc00e1a730f0d5a50c91171c',
          period: 15,
          isAbove: false,
        },
      }),
      // fetcher: async () => {
      //   if (!activeChain || !activeMarket || !currentTime?.seconds) return null;
      //   const activePair = joinStrings(
      //     activeMarket.token0,
      //     activeMarket.token1,
      //     ''
      //   );
      //   const periodInMinutes = currentTime.seconds / 60;
      //   const response = await dsc.get(
      //     `settlement_fee/?environment=${activeChain.id}&product_id=${products.UP_DOWN.product_id}&queryPair=${activePair}`
      //   );
      //   if (response?.data) {
      //     let upFeeObj = response.data['up'].find(
      //       (ob) => ob.period == periodInMinutes
      //     );
      //     let downFeeObj = response.data['down'].find(
      //       (ob) => ob.period == periodInMinutes
      //     );
      //     let res = { up: upFeeObj, down: downFeeObj };
      //     console.log('resfor',res)
      //     res = {
      //       "up": {
      //           "settlement_fee": 1250,
      //           "settlement_fee_sign_expiration": 1727440999,
      //           "settlement_fee_signature": "0x9de65dc09f00a3e343db1dbd90c04fa7f40a78cb0f1210b78cd7847a996e0d2c6b5e0df80ff66824ec3dabc511d32868b05f401972dc00e1a730f0d5a50c91171c",
      //           "period": 15,
      //           "isAbove": true
      //       },
      //       "down": {
      //           "settlement_fee": 1250,
      //           "settlement_fee_sign_expiration": 1727440999,
      //           "settlement_fee_signature": "0x9de65dc09f00a3e343db1dbd90c04fa7f40a78cb0f1210b78cd7847a996e0d2c6b5e0df80ff66824ec3dabc511d32868b05f401972dc00e1a730f0d5a50c91171c",
      //           "period": 15,
      //           "isAbove": false
      //       }
      //   }

      //     return res;
      //   }
      //   return null;
      // },
      refreshInterval: 2500,
    }
  );
  // return data || null;
};
