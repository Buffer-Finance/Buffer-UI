import { useState } from 'react';
import { MultiResolutionChart } from './MultiResolutionChart';
import { createArray } from '@Utils/JSUtils/createArray';
import { usePrice } from '@Hooks/usePrice';
import { useV3AppConfig } from '@Views/V3App/useV3AppConfig';
import { MarketStatsBar, chartNumberAtom } from './MarketStatsBar';
import { useAtomValue } from 'jotai';

const SidebySideCharts = ({
  indexes,
  className,
}: {
  indexes: number[];
  className?: string;
}) => (
  <div className={`flex w-full ${className} `}>
    {indexes.map((id) => (
      <div className={`${indexes.length == 1 ? 'w-full' : 'w-1/2'}`}>
        <MultiResolutionChart market="BTCUSD" index={id} key={id} />
      </div>
    ))}
  </div>
);

const MarketChart: React.FC<any> = ({}) => {
  usePrice();
  const v3AppConfig = useV3AppConfig();
  const chartTimes = useAtomValue(chartNumberAtom);
  if (!v3AppConfig?.length) return <div>Loadding...</div>;
  let chartLayout = <SidebySideCharts indexes={[1]} className="h-full" />;

  if (chartTimes == 2) {
    chartLayout = <SidebySideCharts indexes={[1, 2]} className="h-full" />;
  }
  if (chartTimes == 4) {
    chartLayout = (
      <div className="flex-col w-[100%] h-full">
        <SidebySideCharts indexes={[1, 2]} className="  h-1/2" />
        <SidebySideCharts indexes={[3, 4]} className="  h-1/2" />
      </div>
    );
  }
  return (
    <div className=" flex-grow border-right h-full ">
      <MarketStatsBar />
      {chartLayout}
    </div>
  );
};

export { MarketChart };
