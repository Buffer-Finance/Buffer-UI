import { IconToolTip } from '@Views/TradePage/Components/IconToolTip';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { Switch } from '@Views/TradePage/Components/Switch';
import { SettingsText } from '@Views/TradePage/Components/TextWrapper';

export const PartialFill: React.FC<{
  isOn: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isOn, onToggle }) => {
  return (
    <RowBetween>
      <RowGap gap="4px">
        <SettingsText>Partial fill</SettingsText>
        <IconToolTip
          content={`By enabling "Partial Fill" your trade will be partially filled rather than canceled in case of insufficient funds in the write pool.`}
        />
      </RowGap>
      <Switch isOn={isOn} onChange={onToggle} />
    </RowBetween>
  );
};
