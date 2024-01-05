import { useEffect } from 'react';
import DashboardV2Page from './Components/DashboardV2Page';

export const DashboardV2 = () => {
  useEffect(() => {
    document.title = 'Buffer | Dashboard';
  }, []);

  return (
    <>
      <main className="content-drawer">
        <DashboardV2Page />
      </main>
    </>
  );
};
