import { OngoingTradeSchema, marketType } from '../type';

const addMarketInTrades = (
  trades: OngoingTradeSchema[],
  markets: marketType[] | null
): OngoingTradeSchema[] => {
  if (!markets || !markets?.length) return trades;
  return trades.map((t) => {
    const tradeMarket = markets?.find((pair) => {
      const pool = pair.pools.find(
        (pool) =>
          pool.optionContract.toLowerCase() === t?.target_contract.toLowerCase()
      );
      return !!pool;
    });

    const poolContract = tradeMarket?.pools.find(
      (pool) =>
        pool.optionContract.toLowerCase() === t?.target_contract.toLowerCase()
    )?.pool;
    return {
      ...t,
      market: tradeMarket,
      pool: poolContract,
    };
  });
};

export default addMarketInTrades;
