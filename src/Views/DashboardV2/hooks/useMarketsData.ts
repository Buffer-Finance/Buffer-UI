import { useActiveChain } from '@Hooks/useActiveChain';
import { priceAtom, usePrice } from '@Hooks/usePrice';
import { add } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useMarketsRequest } from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { getCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { appConfig, marketsForChart } from '@Views/TradePage/config';
import {
  chartDataType,
  poolInfoType,
  responseObj,
} from '@Views/TradePage/type';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Market2Prices } from 'src/Types/Market';
import { useOneDayVolume } from './useOneDayVolume';
import { getAddress } from 'ethers/lib/utils.js';
import { secondsToHHMM } from '@Views/TradePage/utils';

export const useMarketsData = () => {
  const { data } = useMarketsRequest();
  const { activeChain } = useActiveChain();
  const marketPrice = useAtomValue(priceAtom);
  const { oneDayVolume } = useOneDayVolume();
  //   console.log(`data: `, data);

  const markets = useMemo(() => {
    if (!data?.optionContracts) return [];
    return data.optionContracts.map((item) => {
      const chartMarketData =
        marketsForChart[item.asset as keyof typeof marketsForChart];
      const poolInfo: poolInfoType =
        appConfig[activeChain.id].poolsInfo[getAddress(item.poolContract)];
      return createMarketObject(
        poolInfo,
        chartMarketData,
        item,
        marketPrice,
        oneDayVolume
      );
    });
  }, [data, oneDayVolume, marketPrice, activeChain]);

  return { markets };
};

function createMarketObject(
  poolInfo: poolInfoType,
  chartMarketData: chartDataType,
  market: responseObj,
  marketPrice: Partial<Market2Prices>,
  oneDayVolume: { [key: string]: string }
) {
  console.log(
    poolInfo,
    chartMarketData,
    market,
    marketPrice,
    oneDayVolume,
    'createMarketObject'
  );
  const poolName = poolInfo.is_pol ? poolInfo.token + '-POL' : poolInfo.token;
  const { currentPrice } = getCurrentPrice(marketPrice, chartMarketData);
  return {
    pair: chartMarketData.pair,
    pool: poolName,
    currentPrice,
    totalTrades: Number(
      fromWei(add(market.openDown, market.openUp), poolInfo.decimals)
    ),
    '24h_volume':
      Number(
        fromWei(oneDayVolume?.[market.address.toLowerCase()], poolInfo.decimals)
      ) || '0',
    min_duration: secondsToHHMM(Number(market.configContract.minPeriod)),
    max_duration: secondsToHHMM(Number(market.configContract.maxPeriod)),
    poolUnit: poolInfo.token,
    openUp: fromWei(market.openUp, poolInfo.decimals),
    openDown: fromWei(market.openDown, poolInfo.decimals),
  };
}
