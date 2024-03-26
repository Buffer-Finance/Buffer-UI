import { BuyTradeHeadText } from '@Views/ABTradePage/Components/TextWrapper';
import { TimePicker } from './TimePicker';
import { ColumnGap } from '@Views/ABTradePage/Components/Column';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  setTimeSelectorAtom,
  timeSelectorAtom,
} from '@Views/ABTradePage/atoms';
import { Trans } from '@lingui/macro';
import { useSwitchPool } from '@Views/ABTradePage/Hooks/useSwitchPool';

export const TimeSelector: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const currentTime = useAtomValue(timeSelectorAtom);
  const setCurrentTime = useSetAtom(setTimeSelectorAtom);
  const { switchPool } = useSwitchPool();

  if (!switchPool) return <></>;

  return (
    <ColumnGap gap={`${className} 7px`}>
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
