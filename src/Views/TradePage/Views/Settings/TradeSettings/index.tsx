import { ColumnGap } from '@Views/TradePage/Components/Column';
import { ResetButton } from '@Views/TradePage/Components/ResetButton';
import { RowGapItemsTop } from '@Views/TradePage/Components/Row';
import { SettingsHeaderText } from '@Views/TradePage/Components/TextWrapper';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';
import { defaultSettings } from '@Views/TradePage/config';
import { useAtom } from 'jotai';
import { PartialFill } from './PartialFill';
import { Slippage } from './Slippage';
import { LimitOrdersExpiry } from './LimitOrdersExpiry';

export const TradeSettings: React.FC = () => {
  const [settings, setSettings] = useAtom(tradeSettingsAtom);

  function resetToDefault() {
    setSettings(defaultSettings.trade);
  }

  function togglePartialFill(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings((prev) => ({
      ...prev,
      partialFill: !prev.partialFill,
    }));
  }

  function setSlippage(newSlippage: number) {
    setSettings((prev) => ({
      ...prev,
      slippageTolerance: newSlippage,
    }));
  }

  return (
    <div>
      <RowGapItemsTop gap="4px">
        <SettingsHeaderText>Trade Settings</SettingsHeaderText>
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