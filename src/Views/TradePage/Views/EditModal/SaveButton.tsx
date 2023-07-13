import { BlueBtn } from '@Views/Common/V2-Button';

export const SaveButton: React.FC<{
  onClick: any;
  isDisabled?: boolean;
  isLoading: boolean;
}> = (props) => {
  return (
    <BlueBtn
      {...props}
      onClick={props.isDisabled ? console.log : props.onClick}
      className={
        props.isDisabled
          ? '!bg-[#282b39] !text-2 !translate-y-[0px] !cursor-not-allowed '
          : '!h-[28px]'
      }
    >
      {props.isDisabled ? 'Limit order Executed!' : 'Save'}
    </BlueBtn>
  );
};
