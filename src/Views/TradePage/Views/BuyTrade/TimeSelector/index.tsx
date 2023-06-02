import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { TimePicker } from './TimePicker';
import { ColumnGap } from '@Views/TradePage/Components/Column';

export const TimeSelector: React.FC = () => {
  return (
    <ColumnGap gap="7px">
      <BuyTradeHeadText>Time</BuyTradeHeadText>
      <TimePicker
        currentTime="00:15"
        max_duration="00:15"
        min_duration="00:01"
        setCurrentTime={() => {
          console.log('lmao dont set');
        }}
      />
    </ColumnGap>
  );
};
