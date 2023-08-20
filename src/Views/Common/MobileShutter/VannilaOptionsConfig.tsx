import { useToast } from '@Contexts/Toast';
import { TradeSizeSelector } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback, useState } from 'react';
import HorizontalTransition from '../Transitions/Horizontal';
import { MobileDurationInput } from '@Views/TradePage/Components/MobileView/MobileDurationInput';
import { MobileShutterProps, useShutterHandlers } from './MobileShutter';
import { BlueBtn } from '../V2-Button';
import { limitOrderStrikeAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
const tabs = ['Amount', 'Duration'];
export const shutterActiveTabAtom = atom(tabs[0]);

const VanillaBOConfigs: React.FC<MobileShutterProps> = () => {
  const { closeShutter } = useShutterHandlers();
  const toastify = useToast();
  const [activeTab, setActiveTab] = useAtom(shutterActiveTabAtom);
  const onSubmit = (e: React.FormEvent) => {
    closeShutter();
  };
  return (
    <>
      <div className="flex w-full mb-4">
        {tabs.map((t) => (
          <div
            className={`w-full text-f12 border-bottom-${
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
          <BlueBtn onClick={onSubmit} className="mt-3">
            Continue
          </BlueBtn>
        </div>
        <form onSubmit={onSubmit}>
          <MobileDurationInput />
        </form>
      </HorizontalTransition>
    </>
  );
};

export { VanillaBOConfigs };
