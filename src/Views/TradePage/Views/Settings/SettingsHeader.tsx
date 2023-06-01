import { CloseButton } from '@Views/TradePage/Components/CloseButton';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { SettingsComponentHeader } from '@Views/TradePage/Components/TextWrapper';

export const SettingsHeader: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <RowBetween>
      <SettingsComponentHeader>Advanced Settings</SettingsComponentHeader>
      <CloseButton onClick={onClose} />
    </RowBetween>
  );
};
