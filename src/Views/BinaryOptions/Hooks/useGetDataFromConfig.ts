import { ENV } from "..";
import MarketConfig from 'public/config.json';

export const useGetDataFromConfig = (contract_address: string) => {
  return MarketConfig[ENV].pairs.find((pair) => {
    return !!pair.pools.find(
      (pool) =>
        pool.options_contracts.current === contract_address ||
        pool.options_contracts.past.includes(contract_address)
    );
  });
};
