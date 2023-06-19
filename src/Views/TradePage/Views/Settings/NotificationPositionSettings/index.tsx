import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { SettingsHeaderText } from '@Views/TradePage/Components/TextWrapper';
import { PositionSelector } from './PositionSelector';
import { useAtom } from 'jotai';
import { defaultSettings } from '@Views/TradePage/config';
import { notificationPositionSettingsAtom } from '@Views/TradePage/atoms';
import { Trans } from '@lingui/macro';
import { useToast } from '@Contexts/Toast';

export const NotificationPositionSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(notificationPositionSettingsAtom);
  const toastify = useToast();

  function resetToDefault() {
    setSettings(defaultSettings.notificationPosition);
    toastify({
      type: 'success',
      msg: 'Notifications will show up here.',
      id: 'notificationPosition',
    });
  }

  function handlePositionClick(position: number) {
    setSettings(position);
    toastify({
      type: 'success',
      msg: 'Notifications will show up here.',
      id: 'notificationPosition',
    });
  }

  return (
    <div>
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Notification Position</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <PositionSelector
        selectedPosition={settings}
        onClick={handlePositionClick}
      />
    </div>
  );
};
