import { BlueBtn } from '@Views/Common/V2-Button';

export const SaveButton: React.FC<{ onClick: any; isLoading: boolean }> = (
  props
) => {
  return (
    <BlueBtn {...props} className="!h-[28px]">
      Save
    </BlueBtn>
  );
};
