import { isTestnet } from 'config';
import React, { ReactNode } from 'react';

export function BuyUSDCLink({ token }: { token: 'USDC' | 'BFR' }) {
  const link = isTestnet
    ? `https://testnet.buffer.finance/ARBITRUM/faucet`
    : token === 'USDC'
    ? 'https://app.uniswap.org/#/tokens/arbitrum/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
    : 'https://app.uniswap.org/#/tokens/arbitrum/0x1a5b0aaf478bf1fda7b934c76e7692d722982a6d';
  return (
    <a href={link} target={!isTestnet ? '_blank' : '_self'}>
      <div className="text-f12 text-3 underline underline-offset-1 font-bold cursor-pointer">
        {/* <EnterIcon /> */}
        Buy {token}
      </div>
    </a>
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
