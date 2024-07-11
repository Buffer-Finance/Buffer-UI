import { useRecentWinners } from '@Hooks/useRecentWinners';
import { useJackpotEvent } from '@Views/Jackpot/useJackpotEvent';
import { JackpotModal } from '@Views/TradePage/Views/AccordionTable/ShareModal/Jackpot';

const RootLevelHooks: React.FC<any> = ({}) => {
  useJackpotEvent();
  // useRecentWinners();
  return <JackpotModal />;
};

export { RootLevelHooks };
