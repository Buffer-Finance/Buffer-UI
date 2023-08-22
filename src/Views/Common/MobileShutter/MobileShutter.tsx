import { atom, useAtomValue, useSetAtom } from 'jotai';
import { LOConfigs } from './LOConfigs';
import { VanillaBOConfigs } from './VannilaOptionsConfig';
import ShutterDrawer from 'react-bottom-drawer';
import { useToast } from '@Contexts/Toast';
import { ReactNode, useCallback } from 'react';
import { MobileMarketPicker } from '@Views/TradePage/Components/MobileView/MarketPicker/MarketPicker';
import { TimePicker } from '@Views/TradePage/Views/BuyTrade/TimeSelector/TimePicker';
import { ActiveTrades } from '@Views/TradePage/Views/BuyTrade/ActiveTrades';
import { ModalChild } from '@Views/TradePage/Views/AccordionTable/ShareModal/ShareModalChild';
export const shutterModalAtom = atom<{
  open:
    | 'LO'
    | 'BO'
    | 'MarketSelector'
    | 'ActiveOrders'
    | 'ShareShutter'
    | false;
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
  const openOngoingTradesShutter = useCallback(() => {
    setShutter({ open: 'ActiveOrders' });
  }, [setShutter]);
  const openShareShutter = useCallback(() => {
    setShutter({ open: 'ShareShutter' });
  }, [setShutter]);
  return {
    closeShutter,
    shutterState,
    openNormalOrdersShutter,
    openLOShutter,
    openMarketPickerShutter,
    openOngoingTradesShutter,
    openShareShutter,
  };
}
export interface MobileShutterProps {
  activeAssetPrice: string;
}
const ShutterProvider: React.FC<MobileShutterProps> = (props) => {
  const { closeShutter, shutterState } = useShutterHandlers();
  const isOpen = typeof shutterState.open == 'string';
  return (
    <ShutterDrawer
      className="bg-[#1F2128] border-none  outline-0 overflow-hidden px-[0px] "
      isVisible={isOpen}
      onClose={closeShutter}
      // mountOnEnter
      // unmountOnExit
    >
      <div className="w-full a600:w-[500px] mx-auto mb-3 mt-2">
        {shutterState.open == 'BO' && <VanillaBOConfigs {...props} />}
        {shutterState.open == 'LO' && <LOConfigs {...props} />}
        {shutterState.open == 'MarketSelector' && <MobileMarketPicker />}{' '}
        {shutterState.open == 'ActiveOrders' && <ActiveTrades isMobile />}{' '}
        {shutterState.open == 'ShareShutter' && (
          <div className="w-full flex flex-col b400:scale-[0.9] origin-left">
            <ModalChild isMobile />
          </div>
        )}
      </div>
    </ShutterDrawer>
  );
};
export default ShutterProvider;
