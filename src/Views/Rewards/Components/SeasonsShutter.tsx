import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback } from 'react';
import ShutterDrawer from 'react-bottom-drawer';
import { Seasons } from './Seasons';
export const shutterModalAtom = atom(false);

export function useShutterHandlers() {
  const setShutter = useSetAtom(shutterModalAtom);
  const shutterState = useAtomValue(shutterModalAtom);
  const closeShutter = useCallback(
    (err?: ReactNode[]) => {
      setShutter(false);
    },
    [setShutter]
  );

  const openShutter = useCallback(
    (err?: ReactNode[]) => {
      setShutter(true);
    },
    [setShutter]
  );

  return {
    closeShutter,
    shutterState,
    openShutter,
  };
}
const SeasonsShutter: React.FC<{
  selectedSeason: number;
  setSelectedSeason: (newSeason: number) => void;
}> = ({ selectedSeason, setSelectedSeason }) => {
  const { closeShutter, shutterState } = useShutterHandlers();
  const isOpen = shutterState === true;

  return (
    <ShutterDrawer
      className="bg-[#1F2128] border-none  outline-0 overflow-hidden px-[0px]"
      isVisible={isOpen}
      onClose={closeShutter}
    >
      <div className="w-full a600:w-[500px] mx-auto mb-3 mt-2">
        <Seasons
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
      </div>
    </ShutterDrawer>
  );
};
export default SeasonsShutter;
