import { CloseButton } from '@Views/TradePage/Components/CloseButton';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { SettingsComponentHeader } from '@Views/TradePage/Components/TextWrapper';
import { Trans } from '@lingui/macro';

export const SettingsHeader: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <RowBetween>
      <SettingsComponentHeader>
        <Trans>Advanced Settings</Trans>
      </SettingsComponentHeader>
      <CloseButton
        onClick={onClose}
        className="hover:brightness-125 hover:scale-125 transition-all duration-100 ease-in-out"
      />
    </RowBetween>
  );
};
