import CustomButton from '@Views/Common/V2-Button';
import { ResetSVG } from '@Views/TradePage/Components/ResetSVG';
import { RowGap } from '@Views/TradePage/Components/Row';
import { setSettingsAtom } from '@Views/TradePage/atoms';
import { defaultSettings } from '@Views/TradePage/config';
import { useSetAtom } from 'jotai';

export const ResetAllButton: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const setSettings = useSetAtom(setSettingsAtom);

  function resetToDefault() {
    setSettings(defaultSettings);
  }
  return (
    <CustomButton
      onClick={resetToDefault}
      className="mx-auto !w-fit bg-[#2c2c41] px-3 py-2 !rounded-sm"
    >
      <RowGap gap="4px">
        <ResetSVG />
        <span className="text-[#BABECE]">Reset All Settings</span>
      </RowGap>
    </CustomButton>
  );
};
