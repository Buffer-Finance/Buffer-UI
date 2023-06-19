import { usePlatformTrades } from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import { OngoingTradesTable } from './OngoingTradesTable';

const PlatformHistory = () => {
  const [ongoingData] = usePlatformTrades();
  return <OngoingTradesTable trades={ongoingData} platform />;
};

export default PlatformHistory;
