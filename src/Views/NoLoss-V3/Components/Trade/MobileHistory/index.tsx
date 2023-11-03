import { useNoLossMarkets } from '@Views/NoLoss-V3/Hooks/useNoLossMarkets';
import { usePastTradeQuery } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { useUpdateActiveTournament } from '@Views/NoLoss-V3/Hooks/useUpdateActiveTournament';
import { userAtom } from '@Views/NoLoss-V3/atoms';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { CancelledTable } from '../MiddleSection/Tables/Cancelled';
import { HistoryTable } from '../MiddleSection/Tables/History';
import { useShutterHandlers } from '../MobileTradePage/Shutters';

const tabs = ['History', 'Cancelled'];
export const activeTabAtom = atom<string>(tabs[0]);

const MobileHistory: React.FC<any> = ({}) => {
  const { closeShutter } = useShutterHandlers();
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const user = useAtomValue(userAtom);
  useUpdateActiveTournament();
  usePastTradeQuery();
  useNoLossMarkets();

  useEffect(() => {
    closeShutter();
    return closeShutter;
  }, []);

  return (
    <main className="w-full a600:w-[500px] mx-auto px-3 mt-4">
      <div className="flex items-center gap-4 my-4">
        {tabs.map((tab) => {
          const isTabActive = activeTab == tab;
          return (
            <button
              onClick={() => setActiveTab(tab)}
              className={`text-f12 ${
                isTabActive ? 'text-1' : 'text-[#808191]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab == 'History' && (
        <MobileHistoryTable userAddress={user?.userAddress} />
      )}
      {activeTab == 'Cancelled' && (
        <MobileCancelledTable userAddress={user?.userAddress} />
      )}
    </main>
  );
};

export { MobileHistory };

export const MobileHistoryTable: React.FC<{
  userAddress: string | undefined;
}> = ({ userAddress }) => {
  return (
    <HistoryTable
      onlyView={[0, 1, 6, 7]}
      overflow={false}
      userAddress={userAddress}
      isMobile
    />
  );
};
const MobileCancelledTable: React.FC<{ userAddress: string | undefined }> = ({
  userAddress,
}) => {
  return (
    <CancelledTable
      onlyView={[0, 1, 2, 4]}
      userAddress={userAddress}
      isMobile
    />
  );
};
