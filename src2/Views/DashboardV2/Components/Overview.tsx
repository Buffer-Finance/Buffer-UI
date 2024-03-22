import { useActiveChain } from '@Hooks/useActiveChain';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { OverviewArbitrum } from './Cards/OverViewArbitrum';
import { OverviewOtherChains } from './Cards/OverviewOtherChains';

export const OverView = () => {
  const { activeChain } = useActiveChain();
  switch (activeChain.id) {
    case arbitrum.id:
    case arbitrumGoerli.id:
      return <OverviewArbitrum />;

    default:
      return <OverviewOtherChains />;
  }
};
