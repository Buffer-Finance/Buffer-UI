import { MultiChart } from 'src/MultiChart';
import { V3AppConfig, useV3AppConfig } from '../useV3AppConfig';
import { marketsForChart } from '../config';
import { joinStrings } from '../helperFns';
import { Skeleton } from '@mui/material';

export const V3MultiChart = () => {
  const appConfig = useV3MultiChartConfig();
  if (!appConfig)
    return (
      <Skeleton
        className="lc sr w-full flex-1 !h-[300px] m-5  "
        variant="rectangular"
      />
    );
  return <MultiChart markets={appConfig} product="binary" />;
};

const useV3MultiChartConfig = (): {
  [key: string]: chartMarkets;
} | null => {
  const appConfig = useV3AppConfig();

  //turn appConfig into a chartMarkets
  let response:
    | {
        [key: string]: chartMarkets;
      }
    | {} = {};

  const loopFn = (market: V3AppConfig) => {
    const marketId = joinStrings(market.token0, market.token1, '');
    response[marketId] = marketsForChart[marketId];
  };

  if (appConfig) {
    appConfig.forEach(loopFn);
  }

  return response;
};

type chartMarkets = {
  [key: string]: {
    price_precision: number;
    pair: string;
    category: string;
    fullName: string;
    tv_id: string;
  };
}[];
