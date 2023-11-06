import { atom, useAtom } from 'jotai';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useAtom(mobileTradePageTabs);
  return (
    <div className="flex items-center gap-[20px] mt-3">
      {['trade', 'leaderboard'].map((tab) => {
        const activeTabClass =
          tab.toLowerCase() === activeTab.toLowerCase()
            ? 'text-1'
            : 'text-[#808191]';
        return (
          <button
            className={`capitalize text-f14 font-medium ${activeTabClass}`}
            onClick={() =>
              setActiveTab(tab.toLowerCase() as 'trade' | 'leaderboard')
            }
            key={tab}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
export const mobileTradePageTabs = atom<'trade' | 'leaderboard'>('trade');
