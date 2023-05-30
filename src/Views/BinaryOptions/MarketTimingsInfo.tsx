import { useSetAtom } from 'jotai';
import { ForexTimingsModalAtom } from './PGDrawer/CustomOption';

interface IMarketTimingsInfo {}

const MarketTimingsInfo: React.FC<IMarketTimingsInfo> = ({}) => {
  const setTimingsModal = useSetAtom(ForexTimingsModalAtom);

  return (
    <>
      <div
        className="bg-1 flex justify-center w-full text-6 text-f14 underline items-center cursor-pointer py-3 hover:text-1 hover:brightness-125"
        onClick={(e) => setTimingsModal(true)}
      >
        Market Timings
      </div>
    </>
  );
};

export { MarketTimingsInfo };
