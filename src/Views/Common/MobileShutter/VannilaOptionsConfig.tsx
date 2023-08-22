import { useToast } from '@Contexts/Toast';
import { TradeSizeSelector } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import HorizontalTransition from '../Transitions/Horizontal';
import { MobileDurationInput } from '@Views/TradePage/Components/MobileView/MobileDurationInput';
import { MobileShutterProps, useShutterHandlers } from './MobileShutter';
import { BlueBtn } from '../V2-Button';
import {
  limitOrderStrikeAtom,
  timeSelectorAtom,
  tradeTypeAtom,
} from '@Views/TradePage/atoms';
import { TimePicker } from '@Views/TradePage/Views/BuyTrade/TimeSelector/TimePicker';
import TimePickerSelection from '../IOSTimePicer/components/TimePickerSelection';
import { IOSTimePicker } from '../IOSTimePicer';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
const tabs = ['Amount', 'Duration'];
export const shutterActiveTabAtom = atom(tabs[0]);

const VanillaBOConfigs: React.FC<MobileShutterProps> = () => {
  const { closeShutter } = useShutterHandlers();

  const toastify = useToast();
  const [activeTab, setActiveTab] = useAtom(shutterActiveTabAtom);
  const onSubmit = (e: React.FormEvent) => {
    closeShutter();
  };
  const currentTime = useAtomValue(timeSelectorAtom);
  const setDuration = useSetAtom(timeSelectorAtom);
  const onChange = (timeValue) => {
    setDuration((val) => ({ ...val, HHMM: timeValue }));
  };
  const { switchPool } = useSwitchPool();

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
          <TradeSizeSelector onSubmit={onSubmit} />
          <BlueBtn onClick={onSubmit} className="mt-4">
            Continue
          </BlueBtn>
        </div>
        <IOSTimePicker
          onChange={onChange}
          initialValue={currentTime.HHMM}
          minValue={switchPool?.min_duration}
          maxValue={switchPool?.max_duration}
          onSave={() => closeShutter()}
        />
      </HorizontalTransition>
    </>
  );
};

export { VanillaBOConfigs };
