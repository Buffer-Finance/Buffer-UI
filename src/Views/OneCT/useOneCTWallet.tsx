import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useProvider, useSigner } from 'wagmi';

const useOneCTWallet = () => {
  const { activeChain } = useActiveChain();
  const [pk, setPk] = useState<string>('');
  const provider = useProvider({ chainId: activeChain.id });
  const signer = useSigner({ chainId: activeChain.id });
  const oneCTWallet = useMemo(() => {
    if (!oneCTPrivate.privateKey) return null;

    return new ethers.Wallet(
      oneCTPrivate.privateKey,
      provider as ethers.providers.StaticJsonRpcProvider
    );
  }, [oneCTPrivate.privateKey, provider]);
  useEffect(() => {
    const pk = secureLocalStorage.getItem('one-ct-wallet-pk');
    if (pk) setPk(pk);
  }, []);

  const generatePk = useCallback(() => {
    signer;
  }, [signer]);
  return {
    loadOrCreate: () => {
      console.log('onect wallet loaded');
    },
  };
};

export { useOneCTWallet };
