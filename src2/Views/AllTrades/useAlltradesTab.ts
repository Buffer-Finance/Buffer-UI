import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useAllTradesTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = useMemo(() => searchParams.get('tab'), [searchParams]);

  function setTab(tab: string) {
    setSearchParams({ tab });
  }

  return { tab, setTab };
};
