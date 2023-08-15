import { useToast } from '@Contexts/Toast';
import { TradeSizeSelector } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback } from 'react';
import ShutterDrawer from 'react-bottom-drawer';
export const shutterModalAtom = atom({ open: false });
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
  const { closeShutter, shutterState } = useShutterHandlers();
  return (
    <ShutterDrawer
      className="bg-1 "
      isVisible={shutterState.open}
      onClose={closeShutter}
      mountOnEnter
      unmountOnExit
    >
      <TradeSizeSelector />
    </ShutterDrawer>
  );
};

export default ShutterProvider;
