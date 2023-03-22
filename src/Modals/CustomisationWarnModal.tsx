import { BlueBtn } from '@Views/Common/V2-Button';
import { ModalBase } from './BaseModal';

const CustomisationWarnModal: React.FC<any> = ({
  onConfirm,
  onCancel,
  open,
}) => {
  return (
    <ModalBase open={open} onClose={onCancel}>
      <div className="flex flex-col">
        <div className="text-f20">
          We respect Traders need of having a <b>Fully Customizable</b> UI.
        </div>
        <div className=" text-f15 mt-5 text-3">
          You can customize <b>everything</b> including tabs like Trade, Active,
          History etc. You can <b>reset UI to default</b> by{' '}
          <b>Reset Layout </b>
          button which can be found under "Advanced Settings" or "Add Chart"
          tab.
        </div>

        <div className="flex items-center justify-center gap-x-3 mt-7 ">
          <BlueBtn onClick={onConfirm} className=" font-semibold">
            Continue
          </BlueBtn>
          <BlueBtn className="!bg-[#303044] font-semibold" onClick={onCancel}>
            Cancel
          </BlueBtn>
        </div>
      </div>
    </ModalBase>
  );
};

export { CustomisationWarnModal };
