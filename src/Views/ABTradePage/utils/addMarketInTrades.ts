import { TradeType } from '../type';
import { marketTypeAB } from '@Views/AboveBelow/types';

const addMarketInTrades = (
  trades: TradeType[],
  markets: marketTypeAB[] | null
): TradeType[] => {
  if (!markets || !markets?.length) return trades;
  return trades
    .map((t) => {
      const tradeMarket = markets?.find((pair) => {
        return pair.address.toLowerCase() === t.target_contract.toLowerCase();
      });

      if (!tradeMarket) return t;
      const pool = tradeMarket.poolInfo;
      return {
        ...t,
        market: tradeMarket,
        pool,
        trade_size: t.total_fee,
      };
    })
    .filter((t) => t !== null) as TradeType[];
};

export default addMarketInTrades;
