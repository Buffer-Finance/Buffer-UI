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
import { MobileChartControllsEditable } from '@Views/TradePage/Components/MobileView/MobileChartControlls';
export const shutterModalAtom = atom<{
  open:
    | 'LO'
    | 'BO'
    | 'MarketSelector'
    | 'ActiveOrders'
    | 'ShareShutter'
    | 'ChartControlls'
    | false;
  payload?: any;
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
  console.log(`MobileShutter-shutterState: `, shutterState);
  const toastify = useToast();
  const closeShutter = useCallback(
    (err?: ReactNode[]) => {
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
  const openChartCotrollShutter = useCallback(
    (chartId: string) => {
      setShutter({ open: 'ChartControlls', payload: chartId });
    },
    [setShutter]
  );
  return {
    closeShutter,
    shutterState,
    openNormalOrdersShutter,
    openLOShutter,
    openMarketPickerShutter,
    openOngoingTradesShutter,
    openShareShutter,
    openChartCotrollShutter,
  };
}
export interface MobileShutterProps {}
const ShutterProvider: React.FC<MobileShutterProps> = (props) => {
  const { closeShutter, shutterState } = useShutterHandlers();
  const isOpen = typeof shutterState.open == 'string';
  // console.log(`MobileShutter-shutterState.open: `, shutterState.open);
  console.log(`MobileShutter-shutterState.open : `, shutterState.open);

  return (
    <ShutterDrawer
      className="bg-[#1F2128] border-none  outline-0 overflow-hidden px-[0px] "
      isVisible={isOpen}
      onClose={closeShutter}
      // mountOnEnter
      // unmountOnExit
    >
      <div className="w-full a600:w-[500px] mx-auto mb-3 mt-2">
        {shutterState.open == 'BO' && <VanillaBOConfigs />}
        {shutterState.open == 'LO' && <LOConfigs />}
        {shutterState.open == 'MarketSelector' && <MobileMarketPicker />}{' '}
        {shutterState.open == 'ShareShutter' && (
          <div className="w-full flex flex-col b400:scale-[0.9] origin-left my-3">
            <ModalChild />
          </div>
        )}
        {shutterState.open == 'ChartControlls' && (
          <MobileChartControllsEditable />
        )}
      </div>
    </ShutterDrawer>
  );
};
export default ShutterProvider;

export const TradesShutter = () => {
  const { closeShutter, shutterState } = useShutterHandlers();
  console.log(`MobileShutter-shutterState: `, shutterState);
  const isOpen = typeof shutterState.open == 'string';

  return (
    <ShutterDrawer
      className="bg-[#1F2128] border-none  outline-0 overflow-hidden px-[0px] "
      isVisible={isOpen}
      onClose={closeShutter}
    >
      <div className="w-full a600:w-[500px] mx-auto mb-3 mt-2">
        {shutterState.open == 'ActiveOrders' && (
          <div className="h-screen">
            <ActiveTrades isMobile />
          </div>
        )}
      </div>
    </ShutterDrawer>
  );
};
