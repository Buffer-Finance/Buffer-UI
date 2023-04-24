import React from 'react';
import ButtonLoader from './ButtonLoader';

interface IButton {
  isLoading?: boolean;
  children?: any;
  isDisabled?: boolean;
  className?: string;
  onClick: () => void;
}
const CustomButton: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled = false,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`flex justify-center items-center transition-all duration-300 w-full rounded-[10px] text-f16 font-bold disabled:bg-cross-bg disabled:text-3 disabled:cursor-not-allowed h-[40px]  ${className}`}
    >
      {isLoading ? <ButtonLoader className="min-w-[50px]" /> : children}
    </button>
  );
};

export const GreenBtn: React.FC<IButton> = ({
  isLoading = false,
  children,
  isDisabled,
  className,
  onClick,
}) => {
  return (
    <CustomButton
      isLoading={isLoading}
      isDisabled={isDisabled || isLoading}
      className={`${className} bg-cross-bg text-green hover:text-1 hover:bg-green`}
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
}) => {
  return (
    <CustomButton
      isLoading={isLoading}
      isDisabled={isDisabled}
      className={`${className} bg-blue text-1 hover:-translate-y-1`}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
};
export const BlackBtn: React.FC<IButton> = ({
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
      className={`${className} bg-cross-bg text-1 hover:-translate-y-1 min-w-[70px] min-h-[30px]`}
      onClick={onClick}
    >
      {children}
    </CustomButton>
  );
};
export default CustomButton;
