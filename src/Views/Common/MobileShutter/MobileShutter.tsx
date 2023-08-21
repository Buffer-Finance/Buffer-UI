import { atom, useAtomValue, useSetAtom } from 'jotai';
import { LOConfigs } from './LOConfigs';
import { VanillaBOConfigs } from './VannilaOptionsConfig';
import ShutterDrawer from 'react-bottom-drawer';
import { useToast } from '@Contexts/Toast';
import { ReactNode, useCallback } from 'react';
import { MobileMarketPicker } from '@Views/TradePage/Components/MobileView/MarketPicker/MarketPicker';
import { TimePicker } from '@Views/TradePage/Views/BuyTrade/TimeSelector/TimePicker';
export const shutterModalAtom = atom<{
  open: 'LO' | 'BO' | 'MarketSelector' | false;
}>({
  open: false,
});

type LimiOrderConfigs = {
  type: 'LO';
  payload: {
    triggerPrice: string;
  };
};
type BinaryOptionConfigs = {
  type: 'BO';
};
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
  const openNormalOrdersShutter = useCallback(() => {
    setShutter({ open: 'BO' });
  }, [setShutter]);
  const openLOShutter = useCallback(() => {
    setShutter({ open: 'LO' });
  }, [setShutter]);
  const openMarketPickerShutter = useCallback(() => {
    setShutter({ open: 'MarketSelector' });
  }, [setShutter]);
  return {
    closeShutter,
    shutterState,
    openNormalOrdersShutter,
    openLOShutter,
    openMarketPickerShutter,
  };
}
export interface MobileShutterProps {
  activeAssetPrice: string;
  onChange: any;
  value: any;
}
const ShutterProvider: React.FC<MobileShutterProps> = (props) => {
  const { closeShutter, shutterState } = useShutterHandlers();
  const isOpen = typeof shutterState.open == 'string';
  return (
    <ShutterDrawer
      className="bg-1 border-none  outline-0 overflow-hidden "
      isVisible={isOpen}
      onClose={closeShutter}
      // mountOnEnter
      // unmountOnExit
    >
      {shutterState.open == 'BO' && <VanillaBOConfigs {...props} />}
      {shutterState.open == 'LO' && <LOConfigs {...props} />}
      {shutterState.open == 'MarketSelector' && <MobileMarketPicker />}{' '}
    </ShutterDrawer>
  );
};
export default ShutterProvider;
