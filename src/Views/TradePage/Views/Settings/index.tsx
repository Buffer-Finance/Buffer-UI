import { PremiumSettings } from './PremiumSettings';
import { MiscSettings } from './MiscSettings';
import { NotificationPositionSettings } from './NotificationPositionSettings';
import { TradePanelSettings } from './TradePanelSettings';
import { ShareSettings } from './ShareSettings';
import { ResetAllButton } from './ResetAllButton';
import { SettingsHeader } from './SettingsHeader';
import { TradeSettings } from './TradeSettings';
import styled from '@emotion/styled';

const SettingsBackground = styled.div`
  background-color: #232334;
  padding: 15px 20px 20px 25px;
  border-radius: 9px;
  flex: 1;
  overflow-y: auto;
  height: 80vh;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 600px) {
    padding: 15px 10px 20px 10px;
  }

  ::-webkit-scrollbar {
    width: 2px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 24px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
  }
`;

const Settings: React.FC<{ className?: string; closeDropdown: () => void }> = ({
  className = '',
  closeDropdown,
}) => {
  return (
    <SettingsBackground className={className}>
      <SettingsHeader onClose={closeDropdown} />
      <TradeSettings />
      <ShareSettings />
      {/* <PremiumSettings /> */}
      <MiscSettings />
      <TradePanelSettings />
      <NotificationPositionSettings />
      <ResetAllButton />
    </SettingsBackground>
  );
};

export { Settings };
