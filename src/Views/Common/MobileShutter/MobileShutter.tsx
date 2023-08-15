import { useToast } from '@Contexts/Toast';
import { TradeSizeSelector } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback, useState } from 'react';
import ShutterDrawer from 'react-bottom-drawer';
import HorizontalTransition from '../Transitions/Horizontal';
import { MobileDurationInput } from '@Views/TradePage/Components/MobileView/MobileDurationInput';
export const shutterModalAtom = atom({ open: false });
const tabs = ['Amount', 'Duration'];
export const shutterActiveTabAtom = atom(tabs[0]);
export function useShutterHandlers() {
  const setShutter = useSetAtom(shutterModalAtom);
  const shutterState = useAtomValue(shutterModalAtom);
  const toastify = useToast();
  const closeShutter = useCallback(
    (err?: ReactNode[]) => {
      if (!err) return setShutter({ open: false });

      if (err.length) {
        toastify({
          msg: err[err.length - 1],
          type: 'error',
          id: err[err.length - 1],
        });
      }
      setShutter({ open: false });
    },
    [setShutter]
  );
  const openShutter = useCallback(() => {
    setShutter({ open: true });
  }, [setShutter]);
  return { closeShutter, shutterState, openShutter };
}

const ShutterProvider = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { closeShutter, shutterState } = useShutterHandlers();
  return (
    <ShutterDrawer
      className="bg-1 border-none  outline-0 overflow-hidden "
      isVisible={shutterState.open}
      onClose={closeShutter}
      // mountOnEnter
      // unmountOnExit
    >
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
        <TradeSizeSelector />
        <MobileDurationInput />
      </HorizontalTransition>
    </ShutterDrawer>
  );
};

export default ShutterProvider;
