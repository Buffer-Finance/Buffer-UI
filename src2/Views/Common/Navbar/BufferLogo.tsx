import BufferLogo from '@Assets/Elements/BufferLogo';
import React from 'react';

export const BufferLogoComponent: React.FC<{
  logoWidth?: number;
  logoHeight?: number;
  className?: string;
  fontSize?: string;
  hideText?:boolean;
}> = ({ logoWidth, logoHeight, className = '', fontSize ,hideText}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <BufferLogo width={logoWidth || 26} height={logoHeight || 26} />
      {!hideText &&<div
        className={`text-1 ${
          fontSize ? fontSize : 'text-[18px]'
        } ml-[4px] font-semibold`}
      >
        Buffer
      </div>}
    </div>
  );
};
