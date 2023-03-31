import { useActiveChain } from '@Hooks/useActiveChain';
import { useActiveAssetState } from '@Views/BinaryOptions/Hooks/useActiveAssetState';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { tokenAtom } from '..';
import { useDashboardTableData } from '../Hooks/useDashboardTableData';
import { DashboardTable } from './DashboardTable';

export const Markets = () => {
  const { dashboardData } = useDashboardTableData();
  const referralcode = useReferralCode();
  const { configContracts } = useActiveChain();
  const activeToken = useAtomValue(tokenAtom);
  const markets = useMemo(() => {
    return configContracts.pairs.map(
      (pair) =>
        pair.pools.find((pool) => pool.token === activeToken)?.options_contracts
          .current
    );
  }, [activeToken, configContracts]);

  const [balance, allowance, maxTrade, stats, routerPermission] =
    useActiveAssetState(null, referralcode);
  const filteredDashboardData = useMemo(() => {
    if (!dashboardData || !routerPermission) return [];
    return dashboardData.filter(
      (data) => routerPermission[data.address] && markets.includes(data.address)
    );
  }, [dashboardData, routerPermission]);

  return (
    <div>
      <DashboardTable dashboardData={filteredDashboardData} />
    </div>
  );
};
