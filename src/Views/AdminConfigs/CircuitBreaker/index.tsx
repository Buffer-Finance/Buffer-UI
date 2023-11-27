import { useMarketsRequest } from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { responseObj } from '@Views/TradePage/type';
import { useMemo } from 'react';
import { InitializeBtn } from './InitializeBtn';
import { Market } from './Market';
import { Pool } from './pool';
import { useReadCallData } from './useReadcallData';

export const CircuitBreaker: React.FC<any> = ({}) => {
  const { data: markets, error } = useMarketsRequest();
  const data = useReadCallData(markets?.optionContracts);

  const marketsFilteredByPool = useMemo(() => {
    if (!data) return null;
    if (!data.readcallData) return null;
    const marketsByPools: {
      [poolName: string]: (responseObj & {
        threshold: string;
      })[];
    } = {};
    data.readcallData.markets.forEach((market) => {
      if (!marketsByPools[market.pool]) {
        marketsByPools[market.pool] = [market];
      } else {
        marketsByPools[market.pool].push(market);
      }
    });
    return marketsByPools;
  }, [data]);

  if (!markets || !markets.optionContracts) return <>No Markets Found.</>;
  if (data === null) return <>No readcall Found.</>;
  const { readcallData } = data;
  if (readcallData === null) return <>No readcall Found.</>;
  return (
    <div className="text-f20 m-5">
      <div className="mb-4">
        APRs
        <div className="ml-3 mt-3 text-f16">
          {readcallData.pools.map((pool) => {
            return <Pool pool={pool} />;
          })}
        </div>
      </div>
      <div>Thresholds</div>
      <div className="ml-3 my-3 text-f16">
        {marketsFilteredByPool ? (
          <div>
            {Object.entries(marketsFilteredByPool).map(
              ([pool, marketsByPool]) => {
                return (
                  <div className="mt-3">
                    {pool}
                    <div className="flex flex-col gap-3 ml-3 mt-3 text-f14">
                      {marketsByPool.map((market) => {
                        return <Market market={market} />;
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <>No markets found.</>
        )}
      </div>
      <InitializeBtn />
    </div>
  );
};
