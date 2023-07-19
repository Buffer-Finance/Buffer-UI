import { useActiveChain } from '@Hooks/useActiveChain';
import { priceAtom } from '@Hooks/usePrice';
import { add } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useMarketsRequest } from '@Views/TradePage/Hooks/GraphqlRequests/useMarketsRequest';
import { getCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { appConfig, marketsForChart } from '@Views/TradePage/config';
import {
  AssetCategory,
  chartDataType,
  poolInfoType,
  responseObj,
} from '@Views/TradePage/type';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Market2Prices } from 'src/Types/Market';
import { getAddress } from 'ethers/lib/utils.js';
import { secondsToHHMM } from '@Views/TradePage/utils';
import { useOneDayVolume } from '../useOneDayVolume';
import { useMarketsReadCallData } from './useMarketsReadcallData';
import { keyValueStringType } from '@Views/DashboardV2/types';
import {
  IBaseSettlementFees,
  useSettlementFee,
} from '@Views/TradePage/Hooks/useSettlementFee';

export const useMarketsData = () => {
  const { data } = useMarketsRequest();
  const { activeChain } = useActiveChain();
  const marketPrice = useAtomValue(priceAtom);
  const { oneDayVolume } = useOneDayVolume();
  const { data: baseSettlementFees } = useSettlementFee();
  const readCallData = useMarketsReadCallData();

  const markets = useMemo(() => {
    if (!data?.optionContracts || !readCallData) return [];
    return data.optionContracts.map((item) => {
      const chartMarketData =
        marketsForChart[item.asset as keyof typeof marketsForChart];
      const poolInfo: poolInfoType = (appConfig as any)[activeChain.id]
        .poolsInfo[getAddress(item.poolContract)];
      const {
        currentOIs,
        isInCreationWindow,
        maxOIs,
        maxTradeSizes,
        settlementFees,
      } = readCallData;
      return createMarketObject(
        poolInfo,
        chartMarketData as chartDataType,
        item,
        marketPrice,
        oneDayVolume,
        currentOIs,
        isInCreationWindow,
        maxOIs,
        maxTradeSizes,
        settlementFees,
        baseSettlementFees
      );
    });
  }, [
    data,
    oneDayVolume,
    marketPrice,
    activeChain,
    readCallData,
    baseSettlementFees,
  ]);

  return { markets };
};

function createMarketObject(
  poolInfo: poolInfoType,
  chartMarketData: chartDataType,
  market: responseObj,
  marketPrice: Partial<Market2Prices>,
  oneDayVolume: keyValueStringType,
  currentOIs: keyValueStringType,
  isInCreationWindow: boolean,
  maxOIs: keyValueStringType,
  maxTradeSizes: keyValueStringType,
  settlementFees: keyValueStringType,
  baseSettlementFees: IBaseSettlementFees | undefined
) {
  const poolName = poolInfo.is_pol ? poolInfo.token + '-POL' : poolInfo.token;
  const { currentPrice } = getCurrentPrice(marketPrice, chartMarketData);
  const marketAddress = getAddress(market.address);
  const isForex = market.category === AssetCategory.Forex;
  const isMarketOpen = !market.isPaused;
  return {
    pair: chartMarketData.pair,
    pool: poolName,
    currentPrice,
    totalTrades: Number(
      fromWei(add(market.openDown, market.openUp), poolInfo.decimals)
    ),
    '24h_volume':
      Number(fromWei(oneDayVolume?.[marketAddress], poolInfo.decimals)) || '0',
    min_duration: secondsToHHMM(Number(market.configContract.minPeriod)),
    max_duration: secondsToHHMM(Number(market.configContract.maxPeriod)),
    poolUnit: poolInfo.token,
    openUp: Number(fromWei(market.openUp, poolInfo.decimals)),
    openDown: Number(fromWei(market.openDown, poolInfo.decimals)),
    current_open_interest: Number(
      fromWei(currentOIs[marketAddress], poolInfo.decimals) || '0'
    ),
    max_open_interest: Number(
      fromWei(maxOIs[marketAddress], poolInfo.decimals) || '0'
    ),
    max_trade_size: Number(
      fromWei(maxTradeSizes[marketAddress], poolInfo.decimals) || '0'
    ),
    is_open: isForex ? isInCreationWindow && isMarketOpen : isMarketOpen,
    payoutForUp:
      settlementFees[marketAddress] ||
      baseSettlementFees?.[market.asset]?.settlement_fee ||
      '0',
    payoutForDown:
      settlementFees[marketAddress] ||
      baseSettlementFees?.[market.asset]?.settlement_fee ||
      '0',
    sort_duration: Number(market.configContract.minPeriod),
  };
}
