import { TimeSelectorDropDown } from '@Views/AboveBelow/Components/BuyTrade/ExpiryDate';
import { generateTimestamps } from '@Views/AboveBelow/Components/BuyTrade/ExpiryDate/helpers';
import { TradeSize } from '@Views/AboveBelow/Components/BuyTrade/TradeSize';
import {
  MobileShutterProps,
  useShutterHandlers,
} from '@Views/AboveBelow/Components/MobileView/Shutters';
import { selectedExpiry } from '@Views/AboveBelow/atoms';
import { atom, useAtom } from 'jotai';
import HorizontalTransition from '../Transitions/Horizontal';
import { BlueBtn } from '../V2-Button';
const tabs = ['Amount', 'Duration'];
export const shutterActiveTabAtom = atom(tabs[0]);

const VanillaBOConfigs: React.FC<MobileShutterProps> = () => {
  const { closeShutter } = useShutterHandlers();
  const [activeTab, setActiveTab] = useAtom(shutterActiveTabAtom);
  const onSubmit = () => {
    closeShutter();
  };

  return (
    <>
      <div className="flex w-full mb-4">
        {tabs.map((t) => (
          <div
            className={`w-full text-f12 pb-3 border-bottom-${
              activeTab == t ? 'blue' : 'grey'
            } text-[#808191]  text-center`}
            key={t}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </div>
        ))}
      </div>
      <HorizontalTransition value={tabs.indexOf(activeTab)}>
        <div>
          <TradeSize onSubmit={onSubmit} />
          <BlueBtn onClick={onSubmit} className="mt-4">
            Continue
          </BlueBtn>
        </div>
        <TimeSelector closeShutter={onSubmit} />
      </HorizontalTransition>
    </>
  );
};

export { VanillaBOConfigs };

const TimeSelector: React.FC<{ closeShutter: () => void }> = ({
  closeShutter,
}) => {
  const {
    oneMinuteTimestamps: oneMinuteArray,
    currentTimeStamp,
    fifteenMinuteTimestamps,
  } = generateTimestamps();
  const [selectedTimestamp, setSelectedTimestamp] = useAtom(selectedExpiry);

  return (
    <TimeSelectorDropDown
      oneMinuteArray={oneMinuteArray}
      fifteenMinuteTimestamps={fifteenMinuteTimestamps}
      selectedTimestamp={selectedTimestamp}
      setSelectedTimestamp={setSelectedTimestamp}
      currentTimeStamp={currentTimeStamp}
      closeDropdown={closeShutter}
      isMobile
    />
  );
};
