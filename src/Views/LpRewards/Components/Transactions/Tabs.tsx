import { transactionTabType } from '@Views/LpRewards/types';

export const Tabs: React.FC<{
  activeTab: transactionTabType;
  setActiveTab: (newTab: transactionTabType) => void;
}> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-7 items-center mt-8 sm:mt-[0]">
      <button
        className={`text-f20 sm:text-f16 font-medium ${
          activeTab === 'all' ? 'text-[#FFFFFF]' : 'text-[#808191]'
        }`}
        onClick={() => setActiveTab('all')}
      >
        User Transactions
      </button>
      <button
        className={`text-f20 sm:text-f16 font-medium ${
          activeTab === 'my' ? 'text-[#FFFFFF]' : 'text-[#808191]'
        }`}
        onClick={() => setActiveTab('my')}
      >
        My Transactions
      </button>
    </div>
  );
};
