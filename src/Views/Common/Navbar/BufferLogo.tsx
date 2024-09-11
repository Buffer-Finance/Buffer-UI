import BufferLogo from '@Assets/Elements/BufferLogo';
import React from 'react';

export const BufferLogoComponent: React.FC<{
  logoWidth?: number;
  logoHeight?: number;
  className?: string;
  fontSize?: string;
  onClick?: () => void;
  hideText?: boolean;
}> = ({
  logoWidth,
  logoHeight,
  className = '',
  fontSize,
  hideText,
  onClick,
}) => {
  return (
    <div className={`flex items-center ${className}`} onClick={onClick}>
      <BufferLogo width={logoWidth || 26} height={logoHeight || 26} />
      {!hideText && (
        <div
          className={`text-1 ${
            fontSize ? fontSize : 'text-[18px]'
          } ml-[4px] font-semibold`}
        >
          Buffer
        </div>
      )}
    </div>
  );
};
