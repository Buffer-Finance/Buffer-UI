import { ReactNode, useEffect } from 'react';
import { PrimaryActionBtn } from '../Buttons';
import Background from './style';
import { removeClass, setOpacity } from '@Utils/appControls/removeMargin';
import { useGlobal } from '@Contexts/Global';
import Drawer from '../v2-Drawer';
import Link from 'react-router';
import { defaultPair } from '@Views/BinaryOptions';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface IMissing {
  children?: ReactNode;
  onClick: (e: any) => void;
  paddingTop?: string;
}

const Missing: React.FC<IMissing> = ({ children, onClick, paddingTop }) => {
  const { activeChain } = useActiveChain();

  return (
    <>
      <main className="content-drawer">
        <Background paddingTop={paddingTop}>
          <img src="/404.png" className="missing-img" />
          <p className="text-f16 text-2 font-extrabold">
            This page is not available on {activeChain.name}.
          </p>
          <span className="text text-6">{children}</span>

          <ConnectButton.Custom>
            {({ openChainModal }) => {
              return (
                <PrimaryActionBtn onClick={openChainModal}>
                  Switch Network
                </PrimaryActionBtn>
              );
            }}
          </ConnectButton.Custom>
        </Background>
      </main>
    </>
  );
};

export default Missing;
