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
    // console.log(`pool: `, pool);
    return {
      ...t,
      market: tradeMarket,
      pool,
    };
  });
};

export default addMarketInTrades;
