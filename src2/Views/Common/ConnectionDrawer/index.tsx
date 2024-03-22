import { IconButton } from '@mui/material';
import { supportedWallets } from 'config';
import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { isDrawerOpen } from 'src/globalStore';
import BackIcon from 'src/SVG/buttons/back';
import { useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import Background from './style';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getChains } from 'src/Config/wagmiClient';

interface IWalletConnection {
  className?: string;
}

export const useWalletConnect = () => {
  const { activeChain } = useActiveChain();
  const [, setIsConnectionDrawerOpen] = useAtom(isDrawerOpen);
  const { connect, connectors, error: connectError } = useConnect();
  const { switchNetwork, error: switchError } = useSwitchNetwork();
  const { chain } = useNetwork();
  const toastify = useToast();
  const { address: account } = useUserAccount();
  const chains = getChains();

  const closeDrawer = useCallback(() => {
    setIsConnectionDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (!activeChain?.id) return;
    if (!chain?.id) return;
    if (account && chain.id === activeChain.id) {
      closeDrawer();
    }
  }, [account, activeChain, chain]);

  const connectHandler = (connectorId: number): void => {
    if (!activeChain?.id) return;
    const chainId = chains.find((chain) => chain.id === activeChain.id).id;
    console.log(`chains: `, chains);

    if (switchNetwork) {
      switchNetwork(chainId);
      if (switchError) {
        console.log(`switchError: `, switchError);
        toastify({
          type: 'error',
          msg: 'Switching networks is not supported on your wallet. Please try with another wallet.',
          id: 'switchWalletError',
        });
      }
    } else {
      connect({
        connector: connectors[connectorId],
        chainId,
      });
      if (connectError) {
        toastify({
          type: 'error',
          msg: 'Please try with another wallet.',
          id: 'connectError',
        });
      }
    }
  };
  return { connectHandler, closeDrawer };
};

const WalletConnection: React.FC<IWalletConnection> = ({ className }) => {
  const { connectHandler, closeDrawer } = useWalletConnect();

  return (
    <Background className={`default-closed ${className}`}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex header">
            <IconButton onClick={closeDrawer} className="button sxxmr">
              <BackIcon />
            </IconButton>
            <span className="sml head-size capitalize text-1">
              Connect Your Wallet
            </span>
          </div>
          {supportedWallets.map((wallet: any, index: number) => (
            <button
              className={
                'wallet bg-1 hover:brightness-125 transition-all duration-300'
              }
              key={index}
              onClick={() => connectHandler(wallet.connectorId)}
            >
              <span className={'label'}>{wallet.name}</span>
              <img
                src={`/wallets/${wallet.img}.svg`}
                alt="img"
                className={`wallet_img`}
              ></img>
            </button>
          ))}
          <div className="msg-text">
            Haven’t installed Metamask yet?&nbsp;
            <a
              className="metamask-link"
              href="https://metamask.io/"
              target="_blank"
              rel="noreferrer"
            >
              Click Here
            </a>
          </div>
        </div>
        {/* <TryTestnetBanner /> */}
      </div>
    </Background>
  );
};

export default WalletConnection;
