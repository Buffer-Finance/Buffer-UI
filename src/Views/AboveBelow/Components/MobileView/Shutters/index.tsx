import { VanillaBOConfigs } from '@Views/Common/MobileShutter/VannilaOptionsConfig';
import { ExpandSVG } from '@Views/TradePage/Components/Expand';
import { MobileChartControllsEditable } from '@Views/TradePage/Components/MobileView/MobileChartControlls';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback } from 'react';
import ShutterDrawer from 'react-bottom-drawer';
import { useNavigate } from 'react-router-dom';
import { ActiveTrades } from '../ActiveTrades';
import { MobileAccordionTable } from './MobileTable';

export const shutterModalAtom = atom<{
  open: 'BO' | 'MarketSelector' | 'ActiveOrders' | 'ChartControlls' | false;
  payload?: any;
}>({
  open: false,
});

export function useShutterHandlers() {
  const setShutter = useSetAtom(shutterModalAtom);
  const shutterState = useAtomValue(shutterModalAtom);
  const closeShutter = useCallback(
    (err?: ReactNode[]) => {
      setShutter({ open: false });
    },
    [setShutter]
  );

  const openNormalOrdersShutter = useCallback(() => {
    setShutter({ open: 'BO' });
  }, [setShutter]);
  const openMarketPickerShutter = useCallback(() => {
    setShutter({ open: 'MarketSelector' });
  }, [setShutter]);
  const openOngoingTradesShutter = useCallback(() => {
    setShutter({ open: 'ActiveOrders' });
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
    openMarketPickerShutter,
    openOngoingTradesShutter,
    openChartCotrollShutter,
  };
}
export interface MobileShutterProps {}
export const Shutters: React.FC<MobileShutterProps> = () => {
  const { closeShutter, shutterState } = useShutterHandlers();
  const isOpen =
    typeof shutterState.open == 'string' && shutterState.open != 'ActiveOrders';

  return (
    <ShutterDrawer
      className="bg-[#1F2128] border-none  outline-0 overflow-hidden px-[0px] "
      isVisible={isOpen}
      onClose={closeShutter}
    >
      <div className="w-full a600:w-[500px] mx-auto mb-3 mt-2">
        {shutterState.open == 'MarketSelector' && <MobileAccordionTable />}
        {shutterState.open == 'ChartControlls' && (
          <MobileChartControllsEditable />
        )}
        {shutterState.open == 'BO' && <VanillaBOConfigs />}
      </div>
    </ShutterDrawer>
  );
};

export const TradesShutter = () => {
  const { closeShutter, shutterState } = useShutterHandlers();

  return (
    <ShutterDrawer
      className="bg-[#1F2128] border-none  outline-0 overflow-hidden px-[0px] "
      isVisible={shutterState.open === 'ActiveOrders'}
      onClose={closeShutter}
    >
      <div className="w-full a600:w-[500px] mx-auto mb-3 mt-2">
        {shutterState.open == 'ActiveOrders' && (
          <div className="h-screen">
            <Trades closeShutter={closeShutter} />
          </div>
        )}
      </div>
    </ShutterDrawer>
  );
};

const Trades: React.FC<{ closeShutter: (err?: ReactNode[]) => void }> = ({
  closeShutter,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full b1200:sticky b1200:top-[0px] b1200:z-50 bg-[#282b39] flex justify-between px-5 text-f14 rounded-t-[8px] py-[8px]  mt-3">
        <div className={' cursor-pointer  text-1'}>Active Trades</div>

        <button
          className={`bg-primary w-[22px] h-[22px] rounded-[6px] grid  place-items-center hover:text-1 transition-colors text-3`}
          onClick={() => {
            closeShutter();
            navigate(`/history`);
          }}
        >
          <ExpandSVG />
        </button>
      </div>
      <ActiveTrades />
    </>
  );
};
