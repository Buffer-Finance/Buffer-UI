import DDArrow from '@SVG/Elements/Arrow';
import WalletIcon from '@SVG/Elements/WalletIcon';
import { userAtom } from '@Views/NoLoss-V3/atoms';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';
import {
  ChainSwitchingModal,
  useChainTutorial,
} from '@Views/TradePage/Views/ChainSwitchingModal';
import { activePoolObjAtom } from '@Views/TradePage/atoms';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAtomValue } from 'jotai';
import React, { ReactNode, SVGProps } from 'react';
import { useMedia } from 'react-use';
import { getAddress } from 'viem';
import { useBalance } from 'wagmi';
import { Display } from '../Tooltips/Display';
import { BlueBtn } from '../V2-Button';

export const AccountDropdown: React.FC = () => {
  const isMobile = useMedia('(max-width:1200px)');
  const { isUserEducated, openTutorial } = useChainTutorial();

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
            <ChainSwitchingModal openConnectModal={openConnectModal} />

            {(() => {
              if (!connected) {
                return (
                  <div
                    role="button"
                    className={`flex items-center text-f13 cursor-pointer h-[31px] w-fit rounded-[7px] pl-3 pr-1 bg-[#191b20] hover:brightness-125 `}
                    onClick={
                      isMobile && !isUserEducated.mobileChainSwitchingIssue
                        ? openTutorial
                        : openConnectModal
                    }
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
                    className={`flex items-center text-f13 cursor-pointer h-[31px] w-fit rounded-[7px] px-3 bg-[#191b20] hover:brightness-125 `}
                    onClick={
                      isMobile && !isUserEducated.mobileChainSwitchingIssue
                        ? openTutorial
                        : openChainModal
                    }
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
                  {/* chain dd */}
                  <div
                    onClick={openChainModal}
                    role="button"
                    test-id="chain-modal"
                    className={`bg-[#191b20] hover:brightness-125 cursor-pointer flex items-center justify-center text-f13  h-[31px] w-max rounded-[7px] px-3 pr-[1px] sm:pr-1 transition-all duration-300 `}
                  >
                    <div className="flex items-center dropdown-value f15 capitalize weight-400">
                      {chain && chain.name && (
                        <img
                          className="h-[18px] w-[18px] mr-[6px] sm:mr-[0px] rounded-full"
                          src={chain.iconUrl}
                          alt={chain.name ?? 'Chain icon'}
                        />
                      )}

                      <span className="sm:hidden">{chain.name}</span>
                    </div>
                    <DDArrow
                      className={` transition-all duration-300 ml-2 ease-out mr-2`}
                    />
                  </div>
                  {/* Accound DD */}
                  <div
                    className={`flex items-center text-f13 cursor-pointer h-[31px] w-fit rounded-[7px] px-[6px] bg-[#191B20] hover:brightness-125 `}
                  >
                    <WalletIcon className="mr-2 ml-1 text-blue" />

                    {/* <TokenAccountBalance /> */}

                    <button
                      className="flex items-center font-[500] ml-2 text-f14 bg-[#2C2C41] px-2 rounded-[4px] pb-1"
                      test-id="account-holder-div"
                      onClick={openAccountModal}
                    >
                      {account ? `${account.address.slice(0, 6)}` : 'Connect'}
                      <DDArrow
                        className={` transition-all duration-300 ml-1 ease-out `}
                      />
                    </button>
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
  mobileTutorial,
  className = '',
}: {
  children: ReactNode;
  className?: string;
  mobileTutorial?: boolean;
}) => {
  const isMobile = useMedia('(max-width:1200px)');
  const { isUserEducated, openTutorial } = useChainTutorial();
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
                  <>
                    <BlueBtn
                      onClick={
                        isMobile && !isUserEducated.mobileChainSwitchingIssue
                          ? openTutorial
                          : openConnectModal
                      }
                      className={'px-5 py-[5px] !h-fit ' + className}
                    >
                      Connect Wallet
                    </BlueBtn>
                  </>
                );
              }

              if (chain.unsupported) {
                return (
                  <BlueBtn
                    onClick={
                      isMobile && !isUserEducated.mobileChainSwitchingIssue
                        ? openTutorial
                        : openChainModal
                    }
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
    className="p-2 w-[31px] h-[31px] bg-[#2C2C41] hover:brightness-110 grid place-items-center rounded-[4px]"
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

const TokenAccountBalance = () => {
  const balance = useAccountBalance();
  return (
    <div className="flex items-center">
      {' '}
      <Display data={balance} className="text-f14" />{' '}
      <img
        src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/w_50,h_50,c_fill,r_max/Assets/${activePoolDetails.token.toLowerCase()}.png`}
        className="w-[16px] h-[16px] ml-2"
      />
    </div>
  );
};

const useAccountBalance = () => {
  const { activePool } = useAtomValue(activePoolObjAtom);
  const user = useAtomValue(userAtom);
  const pools = usePoolByAsset();
  let activePoolDetails = pools[activePool];
  if (activePoolDetails === undefined) activePoolDetails = pools['USDC'];
  if (user === undefined || user.userAddress === undefined) return 0;
  const { data, isError, isLoading, error } = useBalance({
    address: getAddress(user.userAddress),
    token: getAddress(activePoolDetails.tokenAddress),
    watch: true,
  });
  return data?.formatted;
};
