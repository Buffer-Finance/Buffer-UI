import { MultiResolutionChart } from './MultiResolutionChart';
import { usePrice } from '@Hooks/usePrice';
import { MarketStatsBar } from './MarketStatsBar';
import { useAtomValue } from 'jotai';
import { chartNumberAtom, isTableShownAtom } from '@Views/TradePage/atoms';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isWideTableEnabled } from '@Views/BinaryOptions/UserTrades';
import { sleep } from '@TV/useDataFeed';

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
  const isTableExpanded = useAtomValue(isTableShownAtom);
  const v3AppConfig = useMarketsConfig();
  const chartTimes = useAtomValue(chartNumberAtom);
  const { activeMarket } = useActiveMarket();
  const [dragging, setDragging] = useState(false);
  const [containerDim, setContainerDim] = useState<{
    height?: number;
    top?: number;
  }>({});
  const onInitialLoad: React.LegacyRef<HTMLDivElement> = useCallback(
    async (ele) => {
      if (!isTableExpanded) return;
      await sleep(1000);
      const d = ele?.getBoundingClientRect();
      if (!d) return;
      console.log(`index-d: `, d);
      setContainerDim(d);
    },
    [isTableExpanded]
  );
  const onMove = (clientY: number) => {
    if (!clientY) return;
    if (!containerDim?.height) return;
    if (!dragging) return;
    // y = 4
    setContainerDim((currentDim) => {
      if (!currentDim?.top) return {};
      let updatedY: { height: number; top: number } = {};
      const updatedHeight = clientY - currentDim.top;
      const bound = window.innerHeight - (currentDim.top + 50);
      console.log(`index-updatedHeight: `, bound, updatedHeight);
      updatedY.height = Math.min(updatedHeight, bound);
      // updatedY.height = updatedHeight;
      updatedY.top = currentDim.top;
      return updatedY;
    });
  };
  const onMouseMove = (e: MouseEvent) => {
    if (dragging) e.preventDefault();
    onMove(e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    onMove(e.touches[0].clientY);
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });
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
  const onMouseDown = () => {
    setDragging(true);
  };

  console.log(`index-y: `, containerDim?.height);

  return (
    <>
      <div
        className="flex flex-col flex-grow  h-full "
        style={containerDim?.height ? { height: containerDim.height } : {}}
        ref={onInitialLoad}
      >
        <MarketStatsBar />
        {chartLayout}
      </div>
      {isTableExpanded && (
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          className={` w-full   cursor-row-resize h-[5px] hover:bg-blue ${
            dragging ? ' bg-blue brightness-125' : ''
          }`}
          // onDragStart={onDragStart}
          // onDragEnd={onDragEnd}
        ></div>
      )}
    </>
  );
};

export { MarketChart };

/*

------|
      |
------| y = 2 h = 2
....... y = 5 


*/
