import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { TimePicker } from './TimePicker';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { useAtomValue, useSetAtom } from 'jotai';
import { setTimeSelectorAtom, timeSelectorAtom } from '@Views/TradePage/atoms';
import { Trans } from '@lingui/macro';

export const TimeSelector: React.FC = () => {
  const currentTime = useAtomValue(timeSelectorAtom);
  const setCurrentTime = useSetAtom(setTimeSelectorAtom);

  return (
    <ColumnGap gap="7px">
      <BuyTradeHeadText>
        <Trans>Time</Trans>
      </BuyTradeHeadText>
      <TimePicker
        currentTime={currentTime.HHMM}
        max_duration="00:15"
        min_duration="00:01"
        setCurrentTime={setCurrentTime}
      />
    </ColumnGap>
  );
};
