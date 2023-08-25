import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { SettingsHeaderText } from '@Views/TradePage/Components/TextWrapper';
import { useAtom } from 'jotai';
import { TradePanelSideSelector } from './TradePanelSideSelector';
import { defaultSettings } from '@Views/TradePage/config';
import { tradePanelPositionSettingsAtom } from '@Views/TradePage/atoms';
import { Trans } from '@lingui/macro';

export const TradePanelSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(tradePanelPositionSettingsAtom);

  function resetToDefault() {
    setSettings(defaultSettings.tradePanelPosition);
  }
  function setNewPosition(newPosition: number) {
    setSettings((prev) => newPosition);
  }

  return (
    <div className="sm:hidden">
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Trading Panel Side</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <TradePanelSideSelector
        onClick={setNewPosition}
        selectedPosition={settings}
      />
    </div>
  );
};
