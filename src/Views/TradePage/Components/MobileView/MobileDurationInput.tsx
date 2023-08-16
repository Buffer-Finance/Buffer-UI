import DurationPicker from '@Views/Common/DurationPicker/DurationPicker';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

const MobileDurationInput: React.FC<any> = ({}) => {
  const [durationDisplayedOnPicker, setDurationDisplayedOnPicker] =
    useState(undefined);
  console.log(`test-durationDisplayedOnPicker: `, durationDisplayedOnPicker);
  const onChange = (duration) => {
    setDurationDisplayedOnPicker(duration);
  };
  const buttonClickHandler = () => {};
  return (
    <>
      <div>
        <DurationPicker
          onChange={onChange}
          initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
          maxHours={10}
          noSeconds
        />
      </div>
      <button
        onClick={buttonClickHandler}
        type="button"
        style={{ float: 'right' }}
      >
        Confirm Selection
      </button>
    </>
  );
};

export { MobileDurationInput };
