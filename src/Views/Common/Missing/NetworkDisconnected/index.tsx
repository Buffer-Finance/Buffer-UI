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

interface INetworkDisconnected {
  children?: ReactNode;
  onClick: (e: any) => void;
  paddingTop?: string;
}

const NetworkDisconnected: React.FC<INetworkDisconnected> = ({
  children,
  onClick,
  paddingTop,
}) => {
  const { activeChain } = useActiveChain();

  return (
    <>
      <main className="content-drawer">
        <Background paddingTop={paddingTop}>
          <img src="/404.png" className="NetworkDisconnected-img" />
          <p className="text-f16 text-2 font-extrabold">
            We are getting smell that you are not connected to the internet!
          </p>
          <span className="text text-6">{children}</span>

          <ConnectButton.Custom>
            {({ openChainModal }) => {
              return (
                <div className="text-3 text-f16 font-bold">
                  Connect to a fast internet ASAP and get connected to this
                  wonderfull world.
                </div>
              );
            }}
          </ConnectButton.Custom>
        </Background>
      </main>
    </>
  );
};

export default NetworkDisconnected;
