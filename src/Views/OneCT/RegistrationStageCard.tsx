import { BlueBtn } from '@Views/Common/V2-Button';
import { GreenTickMark } from './GreenTickMark';

const desc = 'text-[#C2C1D3] font-normal sm:text-f10';

export const RegistrationStageCard = ({
  onCLick,
  isLoading,
  isStepComplete,
  completeName,
  initialName,
  heading,
  description,
}: {
  onCLick: () => void;
  isLoading: boolean;
  isStepComplete: boolean;
  initialName: string;
  completeName: string;
  heading: string;
  description: string;
}) => (
  <div className="w-full bg-[#2C2C41] p-[20px] sm:px-[12px] sm:py-[12px] flex items-center justify-between rounded-[10px] mt-[12px] text-1 text-f16 sm:text-f14 font-[500]">
    <div className="flex flex-col items-start sm:text-f12">
      {heading}
      <div className={desc}>{description}</div>
    </div>
    <BlueBtn
      className={`${
        isStepComplete ? '!bg-green' : ''
      } !w-[120px] px-[15px] sm:px-3 sm:text-f13`}
      test-id="one-ct-registration-button-god"
      onClick={onCLick}
      isLoading={isLoading}
    >
      {isStepComplete ? (
        <div className="flex items-center">
          {' '}
          <GreenTickMark /> {completeName}
        </div>
      ) : (
        initialName
      )}
    </BlueBtn>{' '}
  </div>
);
