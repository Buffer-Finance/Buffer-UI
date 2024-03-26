import { useToast } from '@Contexts/Toast';
import CustomButton from '@Views/Common/V2-Button';
import { ResetSVG } from '@Views/ABTradePage/Components/ResetSVG';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { setSettingsAtom } from '@Views/ABTradePage/atoms';
import { defaultSettings } from '@Views/ABTradePage/config';
import { Trans } from '@lingui/macro';
import { useSetAtom } from 'jotai';

export const ResetAllButton: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const setSettings = useSetAtom(setSettingsAtom);
  const toastify = useToast();

  function resetToDefault() {
    setSettings(defaultSettings);
    toastify({
      type: 'success',
      msg: 'Notifications will show up here.',
      id: 'notificationPosition',
    });
  }
  return (
    <CustomButton
      onClick={resetToDefault}
      className="mx-auto !w-fit bg-[#2c2c41] px-3 py-2 !rounded-sm"
    >
      <RowGap gap="4px">
        <ResetSVG />
        <span className="text-[#BABECE]">
          <Trans>Reset All Settings</Trans>
        </span>
      </RowGap>
    </CustomButton>
  );
};
