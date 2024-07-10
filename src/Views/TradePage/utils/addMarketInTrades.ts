import { TradeType, marketType } from '../type';

const addMarketInTrades = (
  trades: TradeType[],
  markets: marketType[] | null
): TradeType[] => {
  if (!markets || !markets?.length) return trades;
  return trades.map((t) => {
    const tradeMarket = markets?.find((pair) => {
      const pool = pair.pools.find(
        (pool) =>
          pool.optionContract.toLowerCase() === t?.target_contract.toLowerCase()
      );
      return !!pool;
    });

    const pool = tradeMarket?.pools.find(
      (pool) =>
        pool.optionContract.toLowerCase() === t?.target_contract.toLowerCase()
    );
    if (tradeMarket?.category == 'Forex') {
      t = {
        ...t,
        strike: t.strike * 1000,
        expiry_price: t.expiry_price ? t.expiry_price * 1000 : null,
      };
    }
    // console.log(`pool: `, pool);
    return {
      ...t,
      market: tradeMarket,
      pool,
    };
  });
};

export default addMarketInTrades;
