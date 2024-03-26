import { BlueBtn } from '@Views/Common/V2-Button';

export const SaveButton: React.FC<{
  onClick: any;
  isLoading: boolean;
  isDisabled?: boolean;
  disabledText: string | null;
}> = (props) => {
  return (
    <BlueBtn
      {...props}
      onClick={props.isDisabled ? console.log : props.onClick}
    >
      {props.disabledText || 'Save'}
    </BlueBtn>
  );
};
