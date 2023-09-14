import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowBetween, RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { Switch } from '@Views/TradePage/Components/Switch';
import {
  SettingsHeaderText,
  SettingsText,
} from '@Views/TradePage/Components/TextWrapper';
import { chartControlsSettingsAtom } from '@Views/TradePage/atoms';
import { defaultSettings } from '@Views/TradePage/config';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';

export const ConfirmationModalsSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(chartControlsSettingsAtom);

  function resetToDefault() {
    setSettings(defaultSettings.chartControls);
  }

  function toggleCloseConfirmation(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      earlyCloseConfirmation: !prev.earlyCloseConfirmation,
    }));
  }
  function toggleLODragging(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      loDragging: !prev.loDragging,
    }));
  }

  return (
    <div className="sm:hidden">
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Chart Controls</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>

      <RowBetween className="mt-4">
        <SettingsText>Show early close confirmations</SettingsText>
        <Switch
          isOn={settings.earlyCloseConfirmation}
          onChange={toggleCloseConfirmation}
        />
      </RowBetween>
      <RowBetween className="mt-4">
        <SettingsText>Show drag-n-edit limit orders confirmations</SettingsText>
        <Switch isOn={settings.loDragging} onChange={toggleLODragging} />
      </RowBetween>
    </div>
  );
};
