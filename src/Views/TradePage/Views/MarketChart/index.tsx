import { sleep } from '@TV/useDataFeed';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { chartNumberAtom, isTableShownAtom } from '@Views/TradePage/atoms';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiResolutionChart } from './MultiResolutionChart';
import { PlatformTradesTab } from '@Views/TradePage/PlatformTradesTab';
import { usePlatformEvent, usePlatformEventAB } from '@Hooks/usePlatformEvent';

const SidebySideCharts = ({
  indexes,
  className,
}: {
  indexes: string[];

  className?: string;
}) => {
  return (
    <div className={`flex w-full ${className} `}>
      {indexes.map((id) => (
        <div key={id} className={`${indexes.length == 1 ? 'w-full' : 'w-1/2'}`}>
          <MultiResolutionChart
            market={id.split(':')[0] as any}
            index={+id.split(':')[1]}
            key={id}
          />
        </div>
      ))}
    </div>
  );
};

const MarketChart: React.FC<any> = ({}) => {
  const isTableExpanded = useAtomValue(isTableShownAtom);
  const v3AppConfig = useMarketsConfig();
  const chartTimes = useAtomValue(chartNumberAtom);
  const { activeMarket } = useActiveMarket();
  const [dragging, setDragging] = useState(false);
  const [containerDim, setContainerDim] = useState<{
    height?: number;
    top?: number;
  }>({});
  const containerRef = useRef<HTMLDivElement>();
  const onInitialLoad: React.LegacyRef<HTMLDivElement> = useCallback(
    async (ele: HTMLDivElement) => {
      if (!isTableExpanded) return;
      containerRef.current = ele;
      await sleep(1000);
      const d = ele?.getBoundingClientRect();
      if (!d) return;
      const updatedRect = { ...d, height: null };
      console.log(`index-d: `, updatedRect);
      setContainerDim({ height: null, top: d.top });
    },
    [isTableExpanded]
  );
  const onMove = (clientY: number) => {
    if (!clientY) return;
    // if (!containerDim?.height) return;
    if (!dragging) return;
    // y = 4

    setContainerDim((currentChartContainerDim) => {
      console.log(`index-updatedHeight: `, currentChartContainerDim);

      if (!currentChartContainerDim?.top) return {};

      let updatedChartContainerDim: Partial<{ height: number; top: number }> =
        {};
      const updatedHeight = clientY - currentChartContainerDim.top;
      const bound = window.innerHeight - (currentChartContainerDim.top + 50);
      updatedChartContainerDim.height = Math.min(updatedHeight, bound);
      updatedChartContainerDim.top = currentChartContainerDim.top;

      // since doccument.onmouseup doesn't get fired on TV area, we have to
      // take an offset value while scrolling up
      if (
        containerRef.current &&
        containerRef.current?.getBoundingClientRect().height -
          updatedChartContainerDim.height >
          35
      ) {
        onMouseUp();
      }
      return updatedChartContainerDim;
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
    document.addEventListener('mouseleave', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });
  const { data } = usePlatformEvent();

  const marketPrefix = useMemo(() => activeMarket?.tv_id + ':', [activeMarket]);
  if (!v3AppConfig?.length || !marketPrefix)
    return (
      <Skeleton className="flex w-full !h-full lc !transform-none !my-3" />
    );
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
  chartLayout = (
    <div className="flex h-full flex-grow">
      {chartLayout}
      <PlatformTradesTab events={data} />{' '}
    </div>
  );
  console.log('rerender');
  const onMouseDown = () => {
    // console.log('deb-event -down');
    setDragging(true);
  };

  return (
    <>
      <div
        className={
          'flex flex-col flex-grow   ' +
          (isTableExpanded ? 'h-[33vh]' : 'h-[82vh]')
        }
        style={containerDim?.height ? { height: containerDim.height } : {}}
        ref={onInitialLoad}
      >
        {chartLayout}
      </div>
      {isTableExpanded && (
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          // onMouseLeave={onMouseUp}
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
