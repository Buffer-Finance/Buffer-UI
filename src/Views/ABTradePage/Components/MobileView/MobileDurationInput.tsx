import DurationPicker from '@Views/Common/DurationPicker/DurationPicker';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { TimePicker } from 'react-ios-time-picker';

const MobileDurationInput: React.FC<any> = ({}) => {
  const [value, setValue] = useState('10:00');
  console.log(`MobileDurationInput-value: `, value);

  const onChange = (timeValue) => {
    console.log(`MobileDurationInput-timeValue: `, timeValue);
    setValue(timeValue);
  };

  return (
    <div>
      <TimePicker onChange={onChange} value={value} />
    </div>
  );
};

export { MobileDurationInput };
