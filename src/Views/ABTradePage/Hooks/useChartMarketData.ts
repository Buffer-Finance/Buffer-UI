import { marketsForChart } from '../config';
import { joinStrings } from '../utils';

export const useChartMarketData = () => {
  function getPairNameForChart(token0: string, token1: string) {
    return joinStrings(token0, token1, '');
  }

  function getChartMarketData(
    token0: string,
    token1: string
  ): typeof marketsForChart.ARBUSD {
    const pairName = getPairNameForChart(token0, token1);
    const chartMarket =
      marketsForChart[pairName as keyof typeof marketsForChart];
    return chartMarket as unknown as typeof marketsForChart.ARBUSD;
  }

  return { getChartMarketData };
};
