import { ColumnGap } from '@Views/ABTradePage/Components/Column';
import { ResetButton } from '@Views/ABTradePage/Components/ResetButton';
import { RowGapItemsTop } from '@Views/ABTradePage/Components/Row';
import { SettingsHeaderText } from '@Views/ABTradePage/Components/TextWrapper';
import { tradeSettingsAtom } from '@Views/ABTradePage/atoms';
import { defaultSettings } from '@Views/ABTradePage/config';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';
import { LimitOrdersExpiry } from './LimitOrdersExpiry';
import { PartialFill } from './PartialFill';
import { Slippage } from './Slippage';

export const TradeSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(tradeSettingsAtom);

  function resetToDefault() {
    setSettings(defaultSettings.trade);
  }

  function togglePartialFill(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev: typeof settings) => ({
      ...prev,
      partialFill: !prev.partialFill,
    }));
  }

  function setSlippage(newSlippage: number) {
    setSettings((prev: typeof settings) => ({
      ...prev,
      slippageTolerance: newSlippage,
    }));
  }

  return (
    <div>
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>
          <Trans>Trade Settings</Trans>
        </SettingsHeaderText>
        <ResetButton onClick={resetToDefault} className="mt-1" />
      </RowGapItemsTop>
      <ColumnGap gap="12px">
        <PartialFill onToggle={togglePartialFill} isOn={settings.partialFill} />
        <Slippage
          currentSlippage={settings.slippageTolerance}
          setSlippage={setSlippage}
        />
        <LimitOrdersExpiry />
      </ColumnGap>
    </div>
  );
};
