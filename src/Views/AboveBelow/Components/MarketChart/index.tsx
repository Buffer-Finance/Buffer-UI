import { sleep } from '@TV/useDataFeed';
import {
  aboveBelowMarketsAtom,
  chartNumberAtom,
  isTableShownAtom,
  selectedPoolActiveMarketAtom,
} from '@Views/AboveBelow/atoms';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MultiResolutionChart } from './MultiResolutionChart';

const SidebySideCharts = ({
  indexes,
  className,
  isMobile,
}: {
  indexes: string[];
  isMobile: boolean;
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
            isMobile={isMobile}
          />
        </div>
      ))}
    </div>
  );
};

const MarketChart: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const isTableExpanded = useAtomValue(isTableShownAtom);
  const v3AppConfig = useAtomValue(aboveBelowMarketsAtom);
  const chartTimes = useAtomValue(chartNumberAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const [dragging, setDragging] = useState(false);
  const [containerDim, setContainerDim] = useState<{
    height?: number;
    top?: number;
  }>({});
  const containerRef = useRef<HTMLDivElement>();
  const onInitialLoad: React.LegacyRef<HTMLDivElement> = useCallback(
    async (ele) => {
      if (!isTableExpanded) return;
      containerRef.current = ele;
      await sleep(1000);
      const d = ele?.getBoundingClientRect();
      if (!d) return;
      setContainerDim(d);
    },
    [isTableExpanded]
  );
  const onMove = (clientY: number) => {
    if (!clientY) return;
    if (!containerDim?.height) return;
    if (!dragging) return;
    // y = 4
    setContainerDim((currentChartContainerDim) => {
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

  const marketPrefix = useMemo(() => activeMarket?.tv_id + ':', [activeMarket]);
  if (!v3AppConfig?.length || !marketPrefix)
    return (
      <Skeleton className="flex w-full !h-full lc !transform-none !my-3" />
    );
  let chartLayout = (
    <SidebySideCharts
      indexes={[marketPrefix + 1]}
      className="h-full"
      isMobile={isMobile}
    />
  );
  if (chartTimes == 2) {
    chartLayout = (
      <SidebySideCharts
        indexes={[marketPrefix + 1, marketPrefix + 2]}
        className="h-full"
        isMobile={isMobile}
      />
    );
  }
  if (chartTimes == 2.5) {
    chartLayout = (
      <div className="flex-col w-[100%] h-full">
        <SidebySideCharts
          indexes={[marketPrefix + 1]}
          className="h-1/2"
          isMobile={isMobile}
        />
        <SidebySideCharts
          indexes={[marketPrefix + 2]}
          className="h-1/2"
          isMobile={isMobile}
        />
      </div>
    );
  }
  if (chartTimes == 4) {
    chartLayout = (
      <div className="flex-col w-[100%] h-full">
        <SidebySideCharts
          indexes={[marketPrefix + 1, marketPrefix + 2]}
          className="  h-1/2"
          isMobile={isMobile}
        />
        <SidebySideCharts
          indexes={[marketPrefix + 3, marketPrefix + 4]}
          className="  h-1/2"
          isMobile={isMobile}
        />
      </div>
    );
  }
  const onMouseDown = () => {
    // console.log('deb-event -down');
    setDragging(true);
  };

  return (
    <>
      <div
        className={`flex-1`}
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
          className={` w-full cursor-row-resize h-[5px] hover:bg-blue ${
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
