import { mobileTabsType } from '../types';

export const MobileTabs: React.FC<{
  activeTab: mobileTabsType;
  setActiveTab: React.Dispatch<React.SetStateAction<mobileTabsType>>;
}> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-4 items-center text-[#7F87A7] text-f18 font-bold mb-6 a600:hidden">
      <button
        onClick={() => setActiveTab('deposits')}
        className={`${activeTab === 'deposits' ? 'text-[#ffffff]' : ''}`}
      >
        My Deposits
      </button>
      <button
        onClick={() => setActiveTab('transactions')}
        className={`${activeTab === 'transactions' ? 'text-[#ffffff]' : ''}`}
      >
        Transactions
      </button>
    </div>
  );
};
