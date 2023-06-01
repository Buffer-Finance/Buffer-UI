import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowBetween, RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { Switch } from '@Views/TradePage/Components/Switch';
import {
  SettingsHeaderText,
  SettingsText,
} from '@Views/TradePage/Components/TextWrapper';
import { miscsSettingsAtom } from '@Views/TradePage/atoms';
import { defaultSettings } from '@Views/TradePage/config';
import { useAtom } from 'jotai';

export const MiscSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(miscsSettingsAtom);

  console.log('miscs rerenders');

  function resetToDefault() {
    setSettings(defaultSettings.miscs);
  }

  function toggleShowRecentTrades(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      showFavoriteAsset: !prev.showFavoriteAsset,
    }));
  }

  return (
    <div>
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>Share Related Settings</SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <RowBetween>
        <SettingsText>show favorite Asset</SettingsText>
        <Switch
          isOn={settings.showFavoriteAsset}
          onChange={toggleShowRecentTrades}
        />
      </RowBetween>
    </div>
  );
};
