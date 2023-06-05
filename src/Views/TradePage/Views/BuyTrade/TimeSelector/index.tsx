import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { TimePicker } from './TimePicker';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { useAtomValue, useSetAtom } from 'jotai';
import { setTimeSelectorAtom, timeSelectorAtom } from '@Views/TradePage/atoms';
import { Trans } from '@lingui/macro';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';

export const TimeSelector: React.FC = () => {
  const currentTime = useAtomValue(timeSelectorAtom);
  const setCurrentTime = useSetAtom(setTimeSelectorAtom);
  const { switchPool } = useSwitchPool();

  if (!switchPool) return <></>;

  return (
    <ColumnGap gap="7px">
      <BuyTradeHeadText>
        <Trans>Time</Trans>
      </BuyTradeHeadText>
      <TimePicker
        currentTime={currentTime.HHMM}
        max_duration={switchPool?.max_duration}
        min_duration={switchPool?.min_duration}
        setCurrentTime={setCurrentTime}
      />
    </ColumnGap>
  );
};
