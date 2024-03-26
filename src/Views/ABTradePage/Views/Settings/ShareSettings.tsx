import { ColumnGap } from '@Views/ABTradePage/Components/Column';
import { ResetButton } from '@Views/ABTradePage/Components/ResetButton';
import { RowBetween, RowGapItemsTop } from '@Views/ABTradePage/Components/Row';
import { Switch } from '@Views/ABTradePage/Components/Switch';
import {
  SettingsHeaderText,
  SettingsText,
} from '@Views/ABTradePage/Components/TextWrapper';
import { shareSettingsAtom } from '@Views/ABTradePage/atoms';
import { defaultSettings } from '@Views/ABTradePage/config';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';

export const ShareSettings: React.FC<any> = () => {
  const [settings, setSettings] = useAtom(shareSettingsAtom);

  function resetToDefault() {
    setSettings(defaultSettings.share);
  }

  function toggleShowTradeSize(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      showTradeSize: !prev.showTradeSize,
    }));
  }

  function toggleShowSharePopup(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      showSharePopup: !prev.showSharePopup,
    }));
  }

  return (
    <div>
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Share Related Settings</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <ColumnGap gap="12px">
        <RowBetween>
          <SettingsText>
            <Trans>Show trade size</Trans>
          </SettingsText>
          <Switch
            isOn={settings.showTradeSize}
            onChange={toggleShowTradeSize}
          />
        </RowBetween>
        <RowBetween>
          <SettingsText>
            <Trans>Show share pop up</Trans>
          </SettingsText>
          <Switch
            isOn={settings.showSharePopup}
            onChange={toggleShowSharePopup}
          />
        </RowBetween>
      </ColumnGap>
    </div>
  );
};
