import { RowBetween } from '@Views/TradePage/Components/Row';
import { SettingsText } from '@Views/TradePage/Components/TextWrapper';
import { MinutesInput } from './MinutesInput';
import { useAtom } from 'jotai';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';

export const LimitOrdersExpiry: React.FC = () => {
  const [settings, setSettings] = useAtom(tradeSettingsAtom);

  const setExpiry = (newExpiry: number) => {
    setSettings({ ...settings, limitOrdersExpiry: newExpiry });
  };

  const setFrame = (newFrame: string) => {
    setSettings({ ...settings, selectedTimeFrame: newFrame });
  };

  return (
    <RowBetween>
      <SettingsText>Limit orders expiry time</SettingsText>
      <MinutesInput
        minutes={settings.limitOrdersExpiry}
        onChange={setExpiry}
        activeFrame={settings.selectedTimeFrame}
        setFrame={setFrame}
      />
    </RowBetween>
  );
};
