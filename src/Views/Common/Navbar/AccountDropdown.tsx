import React, { ReactNode, useEffect, useRef } from 'react';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as chain from '@wagmi/core/chains';
import { BlueBtn } from '../V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { SVGProps } from 'react';
import { MenuItem, Skeleton } from '@mui/material';
import { useSetAtom } from 'jotai';
import { snackAtom } from 'src/App';
import { useDisconnect, useProvider } from 'wagmi';
import { useUserAccount } from '@Hooks/useUserAccount';
import {
  uesOneCtActiveChain,
  useOneCTWallet,
} from '@Views/OneCT/useOneCTWallet';
import { Display } from '../Tooltips/Display';
import ETHImage from '../../../../public/tokens/ETH.png';
import DDArrow from '@SVG/Elements/Arrow';
import { ControlledMenu, useClick, useMenuState } from '@szhsin/react-menu';
import NFTtier from '../NFTtier';
import WalletIcon from '@SVG/Elements/WalletIcon';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import copyToClipboard from '@Utils/copyToClipboard';
const token2image = {
  ETH: ETHImage,
};
const chainImageMappipng = {
  [chain.polygon.name]:
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684086043/polygon2.png',
  [chain.polygonMumbai.name]:
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684086043/polygon2.png',
  [chain.arbitrum.name]: '/Chains/ARBITRIUM.png',
  [chain.arbitrumGoerli.name]: '/Chains/ARBITRIUM.png',
  ['BSC']: '/Chains/BSC.png',
};

export const AccountDropdown: React.FC = () => {
  const setSnack = useSetAtom(snackAtom);
  const setOneCTModal = useSetAtom(isOneCTModalOpenAtom);
  const { activeChain } = uesOneCtActiveChain();
  useOngoingTrades();
  const disconnect = useDisconnect();
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  function closeDropdown() {
    toggleMenu(false);
  }

  const { address } = useUserAccount();
  const { disabelLoading, disableOneCt, registeredOneCT, nonce, state } =
    useOneCTWallet();

  const provider = useProvider({ chainId: activeChain.id });
  const blockExplorer = activeChain?.blockExplorers?.default?.url;
  useEffect(() => {
    setOneCTModal(false);
  }, [address]);

  let OneCTManager = (
    <Skeleton variant="rectangular" className="lc sr w-[70px] h-[30px]" />
  );
  if (registeredOneCT) {
    OneCTManager = (
      <BlueBtn
        className="!ml-[13px] !text-f12 !bg-[#2C2C41] !w-fit !px-[10px] !py-[3px] !rounded-[5px] !h-fit !font-[500] "
        onClick={disableOneCt}
        isLoading={disabelLoading}
        isDisabled={state && state === 'PENDING'}
      >
        Deactivate Acount
      </BlueBtn>
    );
  } else
    OneCTManager = (
      <BlueBtn
        className="!ml-[13px] !text-f12 !w-fit !px-[10px] !py-[3px] !rounded-[5px] !h-fit !font-[500]"
        onClick={() => {
          setOneCTModal(true);
        }}
      >
        {nonce && nonce > 0 ? 'Reactivate' : ' Activate'} Acount
      </BlueBtn>
    );

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
                    <WalletIcon className="mr-[6px] ml-1 text-blue" />

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
                    <WalletIcon className="mr-[6px] ml-1" />

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
                  {/* <OneCTButton /> */}
                  <button type="button" ref={ref} {...anchorProps}>
                    <div
                      className={`flex items-center text-f13 cursor-pointer h-[30px] w-fit rounded-[7px] pl-3 bg-[#191B20]  hover:brightness-125 hover:bg-1`}
                    >
                      <WalletIcon className="mr-2 ml-1 text-blue" />
                      <div className="flex items-center">
                        <Display
                          data={account.balanceFormatted}
                          className="text-f14"
                        />
                        <img
                          src={token2image[account.balanceSymbol]}
                          className="w-[14px] h-[14px] ml-2"
                        />
                      </div>
                      <div className="flex items-center font-[500] ml-2 text-f14 bg-[#2C2C41] px-2 rounded-[4px] mx-2 pb-1">
                        {account ? `${account.address.slice(0, 6)}` : 'Connect'}
                        <DDArrow
                          className={` transition-all duration-300 ml-1 ease-out `}
                        />
                      </div>
                    </div>{' '}
                  </button>
                  <ControlledMenu
                    {...menuState}
                    anchorRef={ref}
                    onClose={closeDropdown}
                    viewScroll="initial"
                    direction="bottom"
                    position="initial"
                    align="end"
                    menuClassName={
                      '!p-[0] !rounded-[10px] hover:!rounded-[10px]'
                    }
                    offsetY={10}
                  >
                    <MenuItem className={'!bg-[#232334] text-1 cursor-auto'}>
                      <div className="mx-[10px] my-[10px] mb-[14px]">
                        <div className="flex items-center justify-between text-f14 mb-[20px]">
                          <div className="flex flex-col">
                            {account
                              ? `${account.address.slice(
                                  0,
                                  4
                                )}...${account.address.slice(-4)}`
                              : 'Connect'}
                            <div>
                              <NFTtier userOnly />
                            </div>
                          </div>
                          <div className="flex items-center gap-x-3 text-[#C3C2D4]">
                            <IconBG
                              onClick={(e) => {
                                e.preventDefault();
                                copyToClipboard(account.address);
                                setSnack({
                                  message:
                                    'Account coppied to clipboard Successfully!',
                                  severity: 'success',
                                });
                              }}
                            >
                              <CopyIcon />
                            </IconBG>

                            <IconBG
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(
                                  `${blockExplorer}/address/${account.address}`,
                                  '_blank'
                                );
                              }}
                            >
                              <ShareIcon />
                            </IconBG>
                            <IconBG
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                disconnect.disconnect();
                              }}
                            >
                              <PowerIcon />
                            </IconBG>
                          </div>
                        </div>
                        <div className="flex items-center gap-x-3 text-f14">
                          {OneCTManager}
                          <a
                            className="unset"
                            href="https://www.google.com/"
                            target="_blank"
                          >
                            <div className="text-f12 underline flex items-center ">
                              Learn More{' '}
                              <ShareIcon className=" scale-[0.65] ml-[1px] mb-[-2px]" />
                            </div>
                          </a>
                        </div>
                      </div>{' '}
                    </MenuItem>
                  </ControlledMenu>
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

const IconBG = ({
  children,
  onClick,
}: {
  children: JSX.Element;
  onClick: any;
}) => (
  <div
    className="p-2 w-[30px] h-[30px] bg-[#2C2C41] hover:brightness-110 grid place-items-center rounded-[4px]"
    onClick={onClick}
  >
    {children}
  </div>
);
export const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13.743 2.232 12.068.595a.883.883 0 0 0-.619-.251H6.976c-.967 0-1.75.766-1.75 1.71v6.842c.024.946.809 1.71 1.774 1.71h5.25c.963 0 1.75-.77 1.75-1.71v-6.06a.846.846 0 0 0-.257-.604Zm-1.055 6.664a.433.433 0 0 1-.438.428H6.976a.433.433 0 0 1-.438-.428V2.058c0-.236.196-.428.438-.428h3.5l.024 1.28c0 .472.392.855.875.855h1.288v5.13h.025Zm-5.25 3.42a.433.433 0 0 1-.438.428H1.726a.433.433 0 0 1-.438-.427l.024-6.84c0-.235.196-.427.438-.427h2.625V3.765H1.75C.783 3.765 0 4.53 0 5.475v6.842c0 .943.784 1.71 1.75 1.71H7c.963 0 1.75-.77 1.75-1.71v-.855H7.462l-.024.855Z"
    />
  </svg>
);
export const ShareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9 .344c-.403 0-.769.238-.925.605a.963.963 0 0 0 .216 1.066l1.293 1.261-4.29 4.197a.963.963 0 0 0 0 1.383c.39.382 1.025.382 1.415 0L11 4.66l1.294 1.264c.287.281.715.364 1.09.21a.978.978 0 0 0 .62-.903V1.32a.988.988 0 0 0-1-.977H9Zm-6.5.977C1.119 1.321 0 2.415 0 3.765v7.819c0 1.35 1.119 2.443 2.5 2.443h8c1.381 0 2.5-1.093 2.5-2.443V9.14a.988.988 0 0 0-1-.977c-.553 0-1 .437-1 .977v2.444a.496.496 0 0 1-.5.488h-8c-.275 0-.5-.22-.5-.488v-7.82c0-.268.225-.488.5-.488H5c.553 0 1-.437 1-.977a.988.988 0 0 0-1-.978H2.5Z"
    />
  </svg>
);

export const PowerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M7.875 1.2A.864.864 0 0 0 7 .343a.864.864 0 0 0-.875.855v5.987c0 .473.391.855.875.855a.864.864 0 0 0 .875-.855V1.199ZM3.924 3.566a.843.843 0 0 0 .112-1.205.89.89 0 0 0-1.233-.11C1.359 3.428.438 5.202.438 7.186.438 10.726 3.377 13.6 7 13.6s6.563-2.873 6.563-6.414c0-1.983-.925-3.758-2.369-4.934a.892.892 0 0 0-1.233.11.845.845 0 0 0 .112 1.205 4.648 4.648 0 0 1 1.737 3.619c0 2.597-2.155 4.703-4.813 4.703S2.185 9.783 2.185 7.186c0-1.454.675-2.756 1.736-3.619h.003Z"
    />
  </svg>
);
