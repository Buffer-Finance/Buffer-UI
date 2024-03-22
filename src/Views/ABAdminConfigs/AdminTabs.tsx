import { atom, useAtom } from 'jotai';

export const AdminTabs = () => {
  const [activeTab, setActiveTab] = useAtom(AdminActiveTabAtom);
  const tabs = ['Options'];

  return (
    <div className="flex gap-4 items-center my-3 ml-3">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            className={`text-f15 ${isActive ? 'text-1' : 'text-[#808191]'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export const AdminActiveTabAtom = atom<string>('Options');
