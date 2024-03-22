import React from 'react';
import ButtonLoader from './ButtonLoader';
import { CircularProgress } from '@mui/material';
export const buttonAnimation =
  ' hover:translate-y-[-2.5px] active:translate-y-1 ';
interface IButton extends React.HTMLProps<HTMLButtonElement> {
  isLoading?: boolean;
  children?: any;
  isDisabled?: boolean;
  className?: string;
  onClick: () => void;
  title?: string;
}
const CustomButton: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`${buttonAnimation} !pointer-events-auto flex justify-center items-center transition-all duration-300 w-full rounded-[5px] text-f16 disabled:bg-cross-bg disabled:text-3 disabled:cursor-not-allowed h-[36px]  ${className}`}
    >
      {isLoading ? (
        <CircularProgress
          className="!w-[15px] !h-[15px] mx-[10px]"
          color="inherit"
        />
      ) : (
        children
      )}
    </button>
  );
};
export const BufferButton: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={isDisabled}
      className={`${buttonAnimation} !pointer-events-auto flex justify-center items-center transition-all duration-300 w-full rounded-[5px] text-f16 disabled:bg-cross-bg disabled:text-3 disabled:cursor-not-allowed h-[36px]  ${className}`}
    >
      {isLoading ? (
        <CircularProgress className="!w-[20px] !h-[20px]" color="inherit" />
      ) : (
        children
      )}
    </button>
  );
};

export const GreenBtn: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled,
  className,
  onClick,
  ...props
}) => {
  return (
    <CustomButton
      {...props}
      isLoading={isLoading}
      isDisabled={isDisabled || isLoading}
      className={`${className}  bg-cross-bg text-green hover:text-1 hover:bg-green hover:translate-y-[-3px] active:translate-y-1`}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
};
export const RedBtn: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled,
  className,
  onClick,
}) => {
  return (
    <CustomButton
      isLoading={isLoading}
      isDisabled={isDisabled}
      className={`${className} bg-cross-bg text-red hover:bg-red hover:text-1`}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
};
export const BlueBtn: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled,
  className,
  onClick,
  ...props
}) => {
  return (
    <CustomButton
      isLoading={isLoading}
      isDisabled={isDisabled}
      className={`${className} bg-blue text-1 hover:-translate-y-1`}
      onClick={onClick}
      {...props}
    >
      {children}
    </CustomButton>
  );
};
export const BlackBtn: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled,
  title,
  className,
  onClick,
}) => {
  return (
    <CustomButton
      isLoading={isLoading}
      isDisabled={isDisabled}
      className={`${className} bg-cross-bg text-1 hover:-translate-y-1 min-w-[70px] min-h-[30px]`}
      onClick={onClick}
      title={title}
    >
      {children}
    </CustomButton>
  );
};

export const GreyBtn: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled,
  className,
  onClick,
}) => {
  return (
    <CustomButton
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={onClick}
      className={`bg-[#232334]  ${
        isDisabled ? 'text-2' : 'text-1'
      } text-[#8E8E8E] hover:bg-[#2D2D3A] hover:text-[#FFFFFF] hover:translate-y-[-3px] active:translate-y-1 ${className}`}
    >
      {children}
    </CustomButton>
  );
};

export default CustomButton;
