import { BlueBtn } from '@Views/Common/V2-Button';
import { ModalBase } from './BaseModal';

const ResetWarnModal: React.FC<any> = ({ open, onConfirm, onCancel }) => {
  return (
    <ModalBase open={open} onClose={onCancel}>
      <div className="flex flex-col">
        <div className="text-f20">
          This will reset your chart layouts -<br /> Do you want to reset
          everything now?
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

export { ResetWarnModal };
