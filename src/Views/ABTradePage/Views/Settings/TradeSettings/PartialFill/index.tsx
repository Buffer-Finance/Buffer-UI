import { IconToolTip } from '@Views/ABTradePage/Components/IconToolTip';
import { RowBetween, RowGap } from '@Views/ABTradePage/Components/Row';
import { Switch } from '@Views/ABTradePage/Components/Switch';
import { SettingsText } from '@Views/ABTradePage/Components/TextWrapper';
import { Trans } from '@lingui/macro';

export const PartialFill: React.FC<{
  isOn: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isOn, onToggle }) => {
  return (
    <RowBetween>
      <RowGap gap="4px">
        <SettingsText>
          <Trans>Partial fill</Trans>
        </SettingsText>
        <IconToolTip
          content={
            <Trans>
              By enabling "Partial Fill" your trade will be partially filled
              rather than canceled in case of insufficient funds in the write
              pool.
            </Trans>
          }
        />
      </RowGap>
      <Switch isOn={isOn} onChange={onToggle} />
    </RowBetween>
  );
};
