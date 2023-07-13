import { BlueBtn } from '@Views/Common/V2-Button';

export const SaveButton: React.FC<{
  onClick: any;
  isLoading: boolean;
  isDisabled: boolean;
}> = (props) => {
  return (
    <BlueBtn {...props} className="!h-[28px]">
      Save
    </BlueBtn>
  );
};
