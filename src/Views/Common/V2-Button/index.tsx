import React from 'react';
import ButtonLoader from './ButtonLoader';
export const buttonAnimation =
  ' hover:translate-y-[-2.5px] active:translate-y-1 ';
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
      className={`${buttonAnimation} flex justify-center items-center transition-all duration-300 w-full rounded-[10px] text-f16 font-bold disabled:bg-cross-bg disabled:text-3 disabled:cursor-not-allowed h-[36px]  ${className}`}
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
      className="bg-[#232334] text-[#8E8E8E] hover:bg-[#2D2D3A] hover:text-[#FFFFFF] hover:translate-y-[-3px] active:translate-y-1"
    >
      {children}
    </CustomButton>
  );
};

export default CustomButton;
