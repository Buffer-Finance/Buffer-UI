import { PremiumSettings } from './PremiumSettings';
import { MiscSettings } from './MiscSettings';
import { NotificationPositionSettings } from './NotificationPositionSettings';
import { TradePanelSettings } from './TradePanelSettings';
import { ShareSettings } from './ShareSettings';
import { ResetAllButton } from './ResetAllButton';
import { SettingsHeader } from './SettingsHeader';
import { TradeSettings } from './TradeSettings';

const Settings: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`${className} max-w-[400px] w-full bg-[#232334] h-screen pl-[38px] pr-[30px] pt-[26px] pb-[32px] rounded-[10px] flex flex-col gap-7 overflow-y-auto`}
    >
      <SettingsHeader />
      <TradeSettings />
      <ShareSettings />
      <PremiumSettings />
      <MiscSettings />
      <TradePanelSettings />
      <NotificationPositionSettings />
      <ResetAllButton />
    </div>
  );
};

export { Settings };
