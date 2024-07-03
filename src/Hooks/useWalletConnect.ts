import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { drawerAtom } from 'src/Config/globalAtoms';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { useActiveChain } from './useActiveChain';

export const useWalletConnect = () => {
  const setIsConnectionDrawerOpen = useSetAtom(drawerAtom);
  const { connect, connectors, error: connectError } = useConnect();
  const { switchNetwork, error: switchError } = useSwitchChain();
  const { chain } = useAccount();
  const { activeChain } = useActiveChain();
  // const toastify = useToast();
  const { address: account } = useAccount();

  const closeDrawer = useCallback(() => {
    setIsConnectionDrawerOpen({ isConnectionDrawerOpen: false });
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
    const chainId = activeChain.id;

    if (switchNetwork) {
      switchNetwork(chainId);
      if (switchError) {
        console.log(`[bug:wallet]switchError: `, switchError);
        // toastify({
        //   type: "error",
        //   msg: "Switching networks is not supported on your wallet. Please try with another wallet.",
        //   id: "switchWalletError",
        // });
      }
    } else {
      connect({
        connector: connectors[connectorId],
        chainId,
      });
      if (connectError) {
        console.log(`[bug:wallet]connectError: `, connectError);
        // toastify({
        //   type: "error",
        //   msg: "Please try with another wallet.",
        //   id: "connectError",
        // });
      }
    }
  };
  return { connectHandler, closeDrawer };
};
