import { MultiResolutionChart } from './MultiResolutionChart';
import { usePrice } from '@Hooks/usePrice';
import { MarketStatsBar } from './MarketStatsBar';
import { useAtomValue } from 'jotai';
import { chartNumberAtom } from '@Views/TradePage/atoms';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useMemo } from 'react';

const SidebySideCharts = ({
  indexes,
  className,
}: {
  indexes: string[];
  className?: string;
}) => (
  <div className={`flex w-full ${className} `}>
    {indexes.map((id) => (
      <div className={`${indexes.length == 1 ? 'w-full' : 'w-1/2'}`}>
        <MultiResolutionChart
          market={id.split(':')[0] as any}
          index={+id.split(':')[1]}
          key={id}
        />
      </div>
    ))}
  </div>
);

const MarketChart: React.FC<any> = ({}) => {
  usePrice();
  const v3AppConfig = useMarketsConfig();
  const chartTimes = useAtomValue(chartNumberAtom);
  const { activeMarket } = useActiveMarket();
  const marketPrefix = useMemo(() => activeMarket?.tv_id + ':', [activeMarket]);
  if (!v3AppConfig?.length || !marketPrefix) return <div>Loadding...</div>;
  let chartLayout = (
    <SidebySideCharts indexes={[marketPrefix + 1]} className="h-full" />
  );
  if (chartTimes == 2) {
    chartLayout = (
      <SidebySideCharts
        indexes={[marketPrefix + 1, marketPrefix + 2]}
        className="h-full"
      />
    );
  }
  console.log(`index-chartTimes: `, chartTimes);
  if (chartTimes == 2.5) {
    chartLayout = (
      <div className="flex-col w-[100%] h-full">
        <SidebySideCharts indexes={[marketPrefix + 1]} className="h-1/2" />
        <SidebySideCharts indexes={[marketPrefix + 2]} className="h-1/2" />
      </div>
    );
  }
  if (chartTimes == 4) {
    chartLayout = (
      <div className="flex-col w-[100%] h-full">
        <SidebySideCharts
          indexes={[marketPrefix + 1, marketPrefix + 2]}
          className="  h-1/2"
        />
        <SidebySideCharts
          indexes={[marketPrefix + 3, marketPrefix + 4]}
          className="  h-1/2"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-grow  h-full ">
      <MarketStatsBar />
      {chartLayout}
    </div>
  );
};

export { MarketChart };
