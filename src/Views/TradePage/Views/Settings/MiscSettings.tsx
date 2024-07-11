import { useToast } from '@Contexts/Toast';
import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowBetween, RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { Switch } from '@Views/TradePage/Components/Switch';
import {
  SettingsHeaderText,
  SettingsText,
} from '@Views/TradePage/Components/TextWrapper';
import { miscsSettingsAtom } from '@Views/TradePage/atoms';
import { defaultSettings } from '@Views/TradePage/config';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';

export const MiscSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(miscsSettingsAtom);
  const toastify = useToast();
  function resetToDefault() {
    setSettings(defaultSettings.miscs);
  }

  function toggleShowRecentTrades(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      showFavoriteAsset: !prev.showFavoriteAsset,
    }));
  }
  function togglePlatformWinningNotifications(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (settings.showPlatformWinningsNotification) {
      toastify({
        msg: ' Platform Winnings Notifications turned off!',
        id: 'recent-win-notif',
        type: 'success',
      });
    } else {
      toastify({
        msg: ' Platform Winnings Notifications turned on!',
        id: 'recent-win-notif',
        type: 'success',
      });
    }
    setSettings((prev) => ({
      ...prev,
      showPlatformWinningsNotification: !prev.showPlatformWinningsNotification,
    }));
  }

  return (
    <div className="sm:hidden">
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Miscellaneous</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <RowBetween>
        <SettingsText>
          <Trans>show favorite asset</Trans>
        </SettingsText>
        <Switch
          isOn={settings.showFavoriteAsset}
          onChange={toggleShowRecentTrades}
        />
      </RowBetween>
      {/*  */}
      {/* <RowBetween className="mt-4">
        <SettingsText>Show Platform Winning Notifications</SettingsText>
        <Switch
          isOn={settings.showPlatformWinningsNotification}
          onChange={togglePlatformWinningNotifications}
        />
      </RowBetween> */}
    </div>
  );
};
