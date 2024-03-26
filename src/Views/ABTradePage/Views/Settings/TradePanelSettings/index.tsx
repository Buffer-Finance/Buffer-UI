import { ResetButton } from '@Views/ABTradePage/Components/ResetButton';
import { RowGapItemsTop } from '@Views/ABTradePage/Components/Row';
import { SettingsHeaderText } from '@Views/ABTradePage/Components/TextWrapper';
import { useAtom } from 'jotai';
import { TradePanelSideSelector } from './TradePanelSideSelector';
import { defaultSettings } from '@Views/ABTradePage/config';
import { tradePanelPositionSettingsAtom } from '@Views/ABTradePage/atoms';
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
