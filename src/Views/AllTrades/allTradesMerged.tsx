import { usePrice } from '@Hooks/usePrice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MergedTradesTable from './mergedTradesTable';
import { useAllfilteredData } from './useAllfilteredData';

export const MergedPage = () => {
  return (
    <main className="content-drawer">
      <Merged />
    </main>
  );
};

const Merged = () => {
  const { activeTrades } = useAllfilteredData();
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  usePrice();

  const navigateToProfile = (address: string | undefined | null) => {
    if (address === undefined || address === null) return;
    navigate(`/profile?user_address=${address}`);
  };

  return (
    <div className="px-7 my-8 sm:px-3">
      <MergedTradesTable
        currentPage={totalPages}
        filteredData={activeTrades}
        shouldShowMobile
        totalPages={1}
        onPageChange={(e, p) => setTotalPages(p)}
        widths={['auto']}
        onRowClick={(index) =>
          navigateToProfile(activeTrades[index].user.address)
        }
      />
    </div>
  );
};
