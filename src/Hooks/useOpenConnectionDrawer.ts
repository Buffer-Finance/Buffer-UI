import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { openDrawer } from 'src/Utils/appControls/mobileDrawerHandlers';
import { useAccount } from 'wagmi';
import { useActiveChain } from './useActiveChain';
import { useUserAccount } from './useUserAccount';
import { isDrawerOpen } from 'src/globalStore';

const useOpenConnectionDrawer = () => {
  const [, setIsConnectionDrawerOpen] = useAtom(isDrawerOpen);
  const { dispatch } = useGlobal();
  const { address: account } = useUserAccount();
  const { chain, chains } = useAccount();
  const { activeChain } = useActiveChain();
  const activeChainName = activeChain?.name;

  let shouldConnectWallet = false;
  if (
    !account ||
    (activeChainName &&
      chain &&
      chain.id !== chains.find((chain) => chain.name === activeChainName)?.id)
  ) {
    shouldConnectWallet = true;
  }

  function openWalletDrawer() {
    setIsConnectionDrawerOpen(true);
    dispatch({ type: 'SET_DRAWER', payload: true });
    openDrawer();
  }
  return { openWalletDrawer, shouldConnectWallet };
};

export default useOpenConnectionDrawer;
