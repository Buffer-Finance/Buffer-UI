import {
  ChartElementSVG,
  ChartTypePersistedAtom,
  ChartTypeSelectionDD,
  chartTypes,
} from '@TV/ChartTypeSelectionDD';
import { sleep, supported_resolutions } from '@TV/useDataFeed';
import {
  shutterModalAtom,
  useShutterHandlers,
} from '@Views/Common/MobileShutter/MobileShutter';
import {
  formatResolution,
  isntAvailable,
  market2resolutionAtom,
} from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const MobileChartControlls: React.FC<{ activeMarket: string }> = ({
  activeMarket,
}) => {
  const market2Resolution = useAtomValue(market2resolutionAtom);
  const activeCart = useAtomValue(ChartTypePersistedAtom);
  const chartId = activeMarket + 1;
  const activeResolution = market2Resolution?.[chartId] || '1';
  const activeChartType = activeCart?.[chartId] ?? 1;
  const { openChartCotrollShutter: open } = useShutterHandlers();
  const openChartCotrollShutter = () => open(chartId);
  const find = Object.keys(chartTypes).find(
    (c) => chartTypes[c].type == activeChartType
  );

  const openIndicators = () => {};

  return (
    <div className="flex items-center gap-x-[5px]">
      <button
        className="bg-[#282B39] text-f13 h-[28px] w-[28px] rounded-[5px]"
        onClick={openChartCotrollShutter}
      >
        {formatResolution(activeResolution)}
      </button>
      <div
        className="bg-[#282B39] text-f13 h-[28px] w-[28px] rounded-[5px] grid  place-items-center"
        onClick={openChartCotrollShutter}
      >
        <div className="scale-[0.8] ml-[3px]">{chartTypes[find].icon}</div>
      </div>
      <button
        className="bg-[#282B39] text-f13 h-[28px] w-[28px] rounded-[5px]  grid  place-items-center"
        onClick={openIndicators}
      >
        <ChartElementSVG />
      </button>
    </div>
  );
};
const MobileChartControllsEditable: React.FC<any> = ({}) => {
  const [market2resolution, setMarket2resolution] = useAtom(
    market2resolutionAtom
  );
  const shutterState = useAtomValue(shutterModalAtom);
  const chartId = shutterState.payload;
  const activeResolution = market2resolution?.[chartId] || '1';
  const chartType = useAtomValue(ChartTypePersistedAtom);
  const setChartType = useSetAtom(ChartTypePersistedAtom);

  return (
    <div>
      <div className=" ">
        {' '}
        <div className="flex items-center justify-between">
          {supported_resolutions.map((s) => {
            return (
              <div
                key={s}
                onClick={async () => {
                  setMarket2resolution((m: any) => ({
                    ...m,
                    [chartId]: s,
                  }));
                  await sleep(100);
                  // realTimeUpdateRef.current?.onResetCacheNeededCallback();
                  // widgetRef.current?.activeChart().resetData();
                }}
                className={`${
                  s.toLowerCase() == activeResolution.toLowerCase() &&
                  'scale-125 text-1'
                } ${isntAvailable(s) && 'tb'} text-2 text-f13 font-[500]`}
              >
                {formatResolution(s)}
              </div>
            );
          })}
        </div>
        <ChartTypeSelectionDD
          isMobile
          setActive={(updatedType: number) => {
            // console.log(`updatedType: `, updatedType);
            setChartType((ct: any) => ({ ...ct, [chartId]: updatedType }));
          }}
          active={(chartType as any)[chartId] ?? 1}
        />
      </div>
    </div>
  );
};

export { MobileChartControlls, MobileChartControllsEditable };
