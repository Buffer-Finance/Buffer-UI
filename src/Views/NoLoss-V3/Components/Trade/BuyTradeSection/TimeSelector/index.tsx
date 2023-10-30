import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { BuyTradeHeadText } from '@Views/TradePage/Components/TextWrapper';
import { setTimeSelectorAtom, timeSelectorAtom } from '@Views/TradePage/atoms';
import { secondsToHHMM } from '@Views/TradePage/utils';
import { Trans } from '@lingui/macro';
import { useAtomValue, useSetAtom } from 'jotai';
import { TimePicker } from './TimePicker';

export const TimeSelector: React.FC<{
  className?: string;
  activeMarket: InoLossMarket;
}> = ({ className = '', activeMarket }) => {
  const currentTime = useAtomValue(timeSelectorAtom);
  const setCurrentTime = useSetAtom(setTimeSelectorAtom);

  return (
    <ColumnGap gap={`${className} 7px`}>
      <BuyTradeHeadText>
        <Trans>Time</Trans>
      </BuyTradeHeadText>

      <TimePicker
        currentTime={currentTime.HHMM}
        max_duration={secondsToHHMM(+activeMarket.config.maxPeriod)}
        min_duration={secondsToHHMM(+activeMarket.config.minPeriod)}
        setCurrentTime={setCurrentTime}
      />
    </ColumnGap>
  );
};
