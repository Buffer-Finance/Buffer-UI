import { ResetButton } from '@Views/ABTradePage/Components/ResetButton';
import { RowBetween, RowGapItemsTop } from '@Views/ABTradePage/Components/Row';
import { Switch } from '@Views/ABTradePage/Components/Switch';
import {
  SettingsHeaderText,
  SettingsText,
} from '@Views/ABTradePage/Components/TextWrapper';
import { premiumSettingsAtom } from '@Views/ABTradePage/atoms';
import { defaultSettings } from '@Views/ABTradePage/config';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';

export const PremiumSettings: React.FC<any> = () => {
  const [settings, setSettings] = useAtom(premiumSettingsAtom);

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
