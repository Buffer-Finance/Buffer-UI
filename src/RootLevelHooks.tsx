import { useJackpotEvent } from '@Views/Jackpot/useJackpotEvent';
import { JackpotModal } from '@Views/TradePage/Views/AccordionTable/ShareModal/Jackpot';

const RootLevelHooks: React.FC<any> = ({}) => {
  useJackpotEvent();
  return <JackpotModal />;
};

export { RootLevelHooks };
