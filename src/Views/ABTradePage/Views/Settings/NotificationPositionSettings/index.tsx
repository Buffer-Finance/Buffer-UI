import { ResetButton } from '@Views/ABTradePage/Components/ResetButton';
import { RowGapItemsTop } from '@Views/ABTradePage/Components/Row';
import { SettingsHeaderText } from '@Views/ABTradePage/Components/TextWrapper';
import { PositionSelector } from './PositionSelector';
import { useAtom } from 'jotai';
import { defaultSettings } from '@Views/ABTradePage/config';
import { notificationPositionSettingsAtom } from '@Views/ABTradePage/atoms';
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
