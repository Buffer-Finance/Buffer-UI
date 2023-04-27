import React, { ReactNode } from 'react';
import Wallet from '@Assets/Elements/wallet';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as chain from '@wagmi/core/chains';
import { BlueBtn } from '../V2-Button';

interface IProps {
  inDrawer?: boolean;
}

const chainImageMappipng = {
  [chain.polygon.name]:
    'https://cdn.buffer.finance/Buffer-Website-Data/main/chains/polygon2.png',
  [chain.polygonMumbai.name]:
    'https://cdn.buffer.finance/Buffer-Website-Data/main/chains/polygon2.png',
  [chain.arbitrum.name]: '/Chains/ARBITRIUM.png',
  [chain.arbitrumGoerli.name]: '/Chains/ARBITRIUM.png',
  ['BSC']: '/Chains/BSC.png',
};

export const AccountDropdown: React.FC<IProps> = ({ inDrawer }) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div
                    role="button"
                    className={`flex items-center text-f13 cursor-pointer h-[30px] w-fit rounded-[7px] pl-3 bg-[#232334] hover:brightness-125 hover:bg-1`}
                    onClick={openConnectModal}
                  >
                    <Wallet className="mr-[6px] ml-1 text-blue" />

                    <span>{'Connect Wallet'}</span>
                    <ArrowDropDownRounded
                      className={`dropdown-arrow transition-all duration-300 w-6 h-6 ease-out `}
                    />
                  </div>
                );
              }

              if (chain.unsupported) {
                return (
                  <div
                    role="button"
                    className={`flex items-center text-f13 cursor-pointer h-[30px] w-fit rounded-[7px] pl-3 bg-[#232334] hover:brightness-125 hover:bg-1`}
                    onClick={openChainModal}
                  >
                    <Wallet className="mr-[6px] ml-1" />

                    <span>{'Switch Network'}</span>
                    <ArrowDropDownRounded
                      className={`dropdown-arrow transition-all duration-300 w-6 h-6 ease-out `}
                    />
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 3 }}>
                  <div
                    onClick={openChainModal}
                    role="button"
                    className={`bg-[#232334] hover:brightness-125 hover:bg-1cursor-pointer flex items-center justify-center text-f13  h-[30px] w-max rounded-[7px] pl-3 pr-[1px] sm:pr-1 transition-all duration-300 `}
                  >
                    <div className="flex items-center dropdown-value f15 capitalize weight-400">
                      {chain && chain.name && (
                        <img
                          className="h-[18px] w-[18px] mr-[6px] sm:mr-[0px] rounded-full"
                          src={chain.iconUrl ?? chainImageMappipng[chain.name]}
                          alt={chain.name ?? 'Chain icon'}
                        />
                      )}

                      <span className="sm:hidden">{chain.name}</span>
                    </div>
                    <ArrowDropDownRounded
                      className={`dropdown-arrow transition-all duration-300 w-6 h-6 ease-out `}
                    />
                  </div>
                  <div
                    role="button"
                    className={`flex items-center text-f13 cursor-pointer h-[30px] w-fit rounded-[7px] pl-3 bg-[#232334] hover:brightness-125 hover:bg-1`}
                    onClick={openAccountModal}
                  >
                    <Wallet className="mr-[6px] ml-1 text-blue" />

                    <span>
                      {account
                        ? `${account.address.slice(
                            0,
                            4
                          )}...${account.address.slice(-4)}`
                        : 'Connect'}
                    </span>
                    <ArrowDropDownRounded
                      className={`dropdown-arrow transition-all duration-300 w-6 h-6 ease-out `}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export const ConnectionRequired = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <BlueBtn
                    onClick={openConnectModal}
                    className={'px-5 py-[5px] !h-fit ' + className}
                  >
                    Connect Wallet
                  </BlueBtn>
                );
              }

              if (chain.unsupported) {
                return (
                  <BlueBtn
                    onClick={openChainModal}
                    className={'px-5 py-[5px] !h-fit ' + className}
                  >
                    {/* <Wallet className="" /> */}
                    Switch Network
                  </BlueBtn>
                );
              }
              return children;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
