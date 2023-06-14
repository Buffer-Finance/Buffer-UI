import { BlueBtn } from '@Views/Common/V2-Button';

export const SaveButton: React.FC = () => {
  return (
    <BlueBtn
      onClick={() => {
        console.log('Save button clicked');
      }}
      className="!h-[28px]"
    >
      Save
    </BlueBtn>
  );
};
