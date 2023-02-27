import BufferLogo from '@Assets/Elements/BufferLogo';
import React from 'react';

export const BufferLogoComponent: React.FC<{
  logoWidth?: number;
  logoHeight?: number;
  className?: string;
  fontSize?: string;
}> = ({ logoWidth, logoHeight, className = '', fontSize }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <BufferLogo width={logoWidth || 26} height={logoHeight || 26} />
      <div
        className={`text-1 ${
          fontSize ? fontSize : 'text-[18px]'
        } ml-[4px] font-semibold sm:hidden`}
      >
        Buffer
      </div>
    </div>
  );
};
