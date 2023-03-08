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
          We respect the Trader need of having a <b>Fully Customizable</b> UI.
          But it comes with some responsibilites.
        </div>
        <div className=" text-f16 mt-5">
          You can customize <b>everything</b>. You can make important tabs like
          Trade, History etc hidden accidently and feel lost. <br />
          You can <b>reset UI to default</b> by clicking on <b>Reset </b>button
          under advanced settings section in Trade tab.
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
