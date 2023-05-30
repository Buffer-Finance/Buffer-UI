import { NotificationPositionSelectorSVG } from '../../Components/NotificationPositionSelectorSVG';
import { ResetButton } from '../../Components/ResetButton';
import { TradingPanelSideSelectorSVG } from '../../Components/TradingPanelSideSelectorSVG';
import { Switch } from '../../Components/Switch';
import { useState } from 'react';

const Settings: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOn, setIsOn] = useState(false);
  return (
    <div
      className={`${className} max-w-[400px] w-full bg-[#232334] h-screen pl-[38px] pr-[30px] pt-[26px] pb-[32px] rounded-[10px]`}
    >
      Settings
      <Switch
        isOn={isOn}
        onChange={(event) => {
          console.log('switch');
          setIsOn(!isOn);
        }}
      />
      <ResetButton
        onClick={() => {
          console.log('reset');
        }}
      />
      <NotificationPositionSelectorSVG selectedPosition={0} />
      <TradingPanelSideSelectorSVG selectedSide={1} />
    </div>
  );
};

export { Settings };
