import { usePriceRetriable } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAboveBelowMarketsSetter } from '@Views/AboveBelow/Hooks/useAboveBelowMarketsSetter';
import { usePastTradeQuery } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { AllActive } from '../AllTrades/Active';
import { AllHistory } from '../AllTrades/History';
import { CancelledTable } from '../Tables/Web/CancelledTable';
import { HistoryTable } from '../Tables/Web/HistoryTable';
import { useShutterHandlers } from './Shutters';

const tabs = ['History', 'Cancelled'];
export const activeTabAtom = atom<string>(tabs[0]);

const MobileHistory: React.FC<any> = ({}) => {
  const { closeShutter } = useShutterHandlers();
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const { address: user } = useUserAccount();
  usePastTradeQuery();
  useAboveBelowMarketsSetter();
  useEffect(() => {
    closeShutter();
    return closeShutter;
  }, []);

  return (
    <main className="w-full a600:w-[500px] mx-auto px-3 mt-4">
      <div className="flex items-center gap-4 my-4 text-f12 text-[#808191]">
        {tabs.map((tab) => {
          const isTabActive = activeTab == tab;
          return (
            <button
              onClick={() => setActiveTab(tab)}
              className={` ${isTabActive ? 'text-1' : ''}`}
            >
              {tab}
            </button>
          );
        })}{' '}
        |{' '}
        {['Platform Active', 'Platform History'].map((tab) => {
          const isTabActive = activeTab == tab;
          return (
            <button
              onClick={() => setActiveTab(tab)}
              className={` ${isTabActive ? 'text-1' : ''}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab == 'History' && <MobileHistoryTable userAddress={user} />}
      {activeTab == 'Cancelled' && <MobileCancelledTable userAddress={user} />}
      {activeTab == 'Platform History' && <MobilePlatformHistory />}
      {activeTab == 'Platform Active' && <MobilePlatformActive />}
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

const MobilePlatformHistory: React.FC<{}> = ({}) => {
  return <AllHistory onlyView={[0, 6, 7, 8]} overflow={false} isMobile />;
};

const MobilePlatformActive: React.FC<{}> = ({}) => {
  return <AllActive onlyView={[0, 1, 6, 9]} overflow={false} isMobile />;
};
