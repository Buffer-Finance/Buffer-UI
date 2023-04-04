import { useActiveChain } from '@Hooks/useActiveChain';
import { isOceanSwapOpenAtom } from '@Views/Common/OpenOceanWidget';
import { isTestnet } from 'config';
import { useSetAtom } from 'jotai';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function BuyUSDCLink({ token }: { token: 'USDC' | 'BFR' | 'ARB' }) {
  const { configContracts } = useActiveChain();
  const setSwapAtom = useSetAtom(isOceanSwapOpenAtom);
  const link = isTestnet
    ? `/faucet`
    : `https://app.uniswap.org/#/tokens/arbitrum/${configContracts.tokens[token].address}`;
  if (isTestnet)
    return (
      <Link to={link} target={!isTestnet ? '_blank' : '_self'}>
        <div className="text-f12 text-3 underline underline-offset-1 font-bold cursor-pointer">
          {/* <EnterIcon /> */}
          Buy {token}
        </div>
      </Link>
    );
  return (
    <div
      className="text-f12 text-3 underline underline-offset-1 font-bold cursor-pointer"
      onClick={() => setSwapAtom('USDC')}
    >
      {/* <EnterIcon /> */}
      Buy {token}
    </div>
  );
}
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
