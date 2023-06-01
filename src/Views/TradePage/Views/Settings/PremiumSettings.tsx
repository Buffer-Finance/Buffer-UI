import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowBetween, RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { Switch } from '@Views/TradePage/Components/Switch';
import {
  SettingsHeaderText,
  SettingsText,
} from '@Views/TradePage/Components/TextWrapper';
import { premiumSettingsAtom } from '@Views/TradePage/atoms';
import { defaultSettings } from '@Views/TradePage/config';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';

export const PremiumSettings: React.FC<any> = () => {
  const [settings, setSettings] = useAtom(premiumSettingsAtom);

  console.log('premium rerenders');

  function resetToDefault() {
    setSettings(defaultSettings.premium);
  }

  function toggleShowRecentTrades(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      showRecentTrades: !prev.showRecentTrades,
    }));
  }

  return (
    <div>
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Premium Features</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <RowBetween>
        <SettingsText>
          <Trans>show recent trade</Trans>
        </SettingsText>
        <Switch
          isOn={settings.showRecentTrades}
          onChange={toggleShowRecentTrades}
        />
      </RowBetween>
    </div>
  );
};
