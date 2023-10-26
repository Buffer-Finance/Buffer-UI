import { RowBetween } from '@Views/TradePage/Components/Row';
import { SettingsText } from '@Views/TradePage/Components/TextWrapper';
import { MinutesInput } from './MinutesInput';
import { useAtom } from 'jotai';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';
import { Trans } from '@lingui/macro';

export const LimitOrdersExpiry: React.FC = () => {
  const [settings, setSettings] = useAtom(tradeSettingsAtom);

  const setExpiry = (newExpiry: string) => {
    setSettings({ ...settings, limitOrdersExpiry: newExpiry });
  };

  const setFrame = (newFrame: string) => {
    setSettings({ ...settings, selectedTimeFrame: newFrame });
  };

  return (
    <RowBetween>
      <SettingsText>
        <Trans>Limit orders expiry time</Trans>
      </SettingsText>
      <MinutesInput
        minutes={settings.limitOrdersExpiry}
        onChange={setExpiry}
        activeFrame={settings.selectedTimeFrame}
        setFrame={setFrame}
      />
    </RowBetween>
  );
};
