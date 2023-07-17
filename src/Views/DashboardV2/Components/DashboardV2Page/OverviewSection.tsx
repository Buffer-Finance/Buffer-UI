import { Section } from '@Views/Earn/Components/Section';
import { descStyles, topStyles } from '.';
import { ChainSwitchDropdown } from '../ChainSwitchDropdown';
import { useMemo } from 'react';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getStatsStartingDate } from '@Views/DashboardV2/utils/getStatsStartingDate';
import { OverviewArbitrum } from '../Cards/OverViewArbitrum';

//TODO - handle other chains and add openInterest
export const OverViewSection = () => {
  const { activeChain } = useActiveChain();
  const subHeading = useMemo(
    () => getStatsStartingDate(activeChain.id),
    [activeChain]
  );
  return (
    <Section
      Heading={
        <div className="flex items-center">
          <div className={topStyles}>Dashboard</div>
          <ChainSwitchDropdown baseUrl="/dashboard" />{' '}
        </div>
      }
      subHeading={<div className={descStyles}>{subHeading}</div>}
      Cards={[<OverviewArbitrum />]}
    />
  );
};
