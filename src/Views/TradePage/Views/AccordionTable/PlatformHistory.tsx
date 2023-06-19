import { usePlatformTrades } from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import { HistoryTable } from './HistoryTable';

const PlatformHistory = () => {
  const [_, ongoingData] = usePlatformTrades();
  return <HistoryTable trades={ongoingData} platform />;
};

export default PlatformHistory;
