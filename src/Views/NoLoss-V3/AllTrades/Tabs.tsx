import { tabsNames } from './atoms';

export const Tabs: React.FC<{
  activeTab: tabsNames;
  setActiveTab: (newTab: tabsNames) => void;
}> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="my-3 flex gap-5">
      {[tabsNames[0], tabsNames[1], tabsNames[2], tabsNames[3]].map(
        (tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              onClick={() => setActiveTab(index)}
              className={`capitalize text-f15 ${
                isActive ? 'text-1' : 'text-[#808191]'
              }`}
            >
              {tab}
            </button>
          );
        }
      )}
    </div>
  );
};
