import { useMarketsRequest } from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { responseObj } from '@Views/TradePage/type';
import { useMemo } from 'react';
import { useReadCallData } from './useReadcallData';

export const CircuitBreaker: React.FC<any> = ({}) => {
  const { data: markets, error } = useMarketsRequest();
  useReadCallData(markets?.optionContracts);

  const marketsFilteredByPool = useMemo(() => {
    if (!markets || error) return null;
    if (!markets.optionContracts) return null;
    const marketsByPools: { [poolName: string]: responseObj[] } = {};
    markets.optionContracts.forEach((market) => {
      if (!marketsByPools[market.pool]) {
        marketsByPools[market.pool] = [market];
      } else {
        marketsByPools[market.pool].push(market);
      }
    });
    return marketsByPools;
  }, [markets]);
  if (!marketsFilteredByPool) return <>No Data Found.</>;
  console.log(marketsFilteredByPool, 'marketsFilteredByPool');
  return (
    <div>
      {Object.keys(marketsFilteredByPool).map((poolName) => {
        return (
          <div className="mt-5">
            <div className="text-f15">{poolName}</div>
            <div className="ml-4">
              {marketsFilteredByPool[poolName].map((market) => {
                return <div className="text-f14 mt-2">{market.asset}</div>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
