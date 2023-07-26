import { useActiveChain } from '@Hooks/useActiveChain';
import { isOceanSwapOpenAtom } from '@Views/Common/OpenOceanWidget';
import { isTestnet } from 'config';
import { useSetAtom } from 'jotai';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const BufferRedirectionLink: React.FC<{
  newTab?: boolean;
  children?: ReactNode;
  className?: string;
  link?: string;
}> = ({ newTab, children, className, link }) => {
  return (
    <a href={link} target={newTab ? '_blank' : '_self'} className="inline">
      <div
        className={
          'hover:underline underline-offset-1 font-bold cursor-pointer text-buffer-blue ' +
          className
        }
      >
        {/* <EnterIcon /> */}
        {children}
      </div>
    </a>
  );
};
