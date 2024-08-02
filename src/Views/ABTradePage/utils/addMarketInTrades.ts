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

      if (!tradeMarket) return null;
      if (!tradeMarket) return t;
      const pool = tradeMarket.poolInfo;
      if (tradeMarket?.category == 'Forex') {
        t = {
          ...t,
          strike: t.strike * 1000,
          expiry_price: t.expiry_price ? t.expiry_price * 1000 : null,
        };
      }
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
