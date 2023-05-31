import { RowBetween } from '@Views/TradePage/Components/Row';
import { SettingsText } from '@Views/TradePage/Components/TextWrapper';

export const LimitOrdersExpiry: React.FC = () => {
  return (
    <RowBetween>
      <SettingsText>Limit orders expiry time</SettingsText>
    </RowBetween>
  );
};
