import { IOSTimePicker } from '@Views/Common/IOSTimePicer';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { BlueBtn } from '@Views/Common/V2-Button';
import { activeMarketDataAtom } from '@Views/NoLoss-V3/atoms';
import { timeSelectorAtom } from '@Views/TradePage/atoms';
import { HHMMToSeconds, secondsToHHMM } from '@Views/TradePage/utils';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { TradeSizeSelector } from '../BuyTradeSection/TradeSizeSelector';
import { useShutterHandlers } from './Shutters';
const tabs = ['Amount', 'Duration'];
export const shutterActiveTabAtom = atom(tabs[0]);

export const EditTradeConfigShutter: React.FC = () => {
  const { closeShutter } = useShutterHandlers();
  const [activeTab, setActiveTab] = useAtom(shutterActiveTabAtom);
  const onSubmit = (e: React.FormEvent) => {
    closeShutter();
  };
  const currentTime = useAtomValue(timeSelectorAtom);
  const setDuration = useSetAtom(timeSelectorAtom);
  const onChange = (timeValue: string) => {
    const seconds = HHMMToSeconds(timeValue);
    setDuration({ HHMM: timeValue, seconds });
  };
  const activeMarket = useAtomValue(activeMarketDataAtom);
  if (!activeMarket) return <>No ActiveMarket FOund.</>;
  return (
    <>
      <div className="flex w-full mb-4">
        {tabs.map((t) => (
          <div
            className={`w-full text-f12 pb-3 border-bottom-${
              activeTab == t ? 'blue' : 'grey'
            } text-[#808191]  text-center`}
            key={t}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </div>
        ))}
      </div>
      <HorizontalTransition value={tabs.indexOf(activeTab)}>
        <div>
          {/* <MarketStatsBar isMobile /> */}
          <TradeSizeSelector activeMarket={activeMarket} onSubmit={onSubmit} />
          <BlueBtn onClick={onSubmit} className="mt-4">
            Continue
          </BlueBtn>
        </div>
        <IOSTimePicker
          onChange={onChange}
          initialValue={currentTime.HHMM}
          max_duration={secondsToHHMM(+activeMarket.config.maxPeriod)}
          min_duration={secondsToHHMM(+activeMarket.config.minPeriod)}
          onSave={(time: string) => {
            onChange(time);
            closeShutter();
          }}
        />
      </HorizontalTransition>
    </>
  );
};
