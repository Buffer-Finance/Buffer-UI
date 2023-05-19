import { useActiveChain } from '@Hooks/useActiveChain';
import { divide } from '@Utils/NumString/stringArithmatics';
import { activeAssetStateAtom } from '@Views/BinaryOptions';
import { setActiveAssetStateAtom } from '@Views/BinaryOptions';
import { useActivePoolObj } from '@Views/BinaryOptions/PGDrawer/PoolDropDown';
import { ethers } from 'ethers';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useAccount, useProvider, useSigner } from 'wagmi';

export const is1CTEnabled = (
  account: string[],
  pk: string | null,
  provider: any
) => {
  if (!account || !pk || !provider) return null;
  if (!account?.[0]) return null;
  const oneCTWallet = new ethers.Wallet(
    pk,
    provider as ethers.providers.StaticJsonRpcProvider
  );
  console.log(
    `useOneCTWallet-account: `,
    account,
    oneCTWallet.address,
    provider
  );
  return oneCTWallet.address.toLowerCase() === account[0].toLowerCase();
};

const useOneCTWallet = () => {
  const { address } = useAccount();
  const res = useAtomValue(activeAssetStateAtom);
  const [createLoading, setCreateLoading] = useState(false);

  const { activeChain } = useActiveChain();
  const [oneCtPk, setPk] = useState<string | null>(null);
  const provider = useProvider({ chainId: activeChain.id });
  const registeredOneCT = res.user2signer
    ? is1CTEnabled(res.user2signer, oneCtPk, provider)
    : false;
  const { data: signer } = useSigner({ chainId: activeChain.id });
  const oneCTWallet = useMemo(() => {
    if (!oneCtPk) return null;
    return new ethers.Wallet(
      oneCtPk,
      provider as ethers.providers.StaticJsonRpcProvider
    );
  }, [oneCtPk, provider]);

  const pkLocalStorageIdentifier = 'one-ct-wallet-pk' + address;
  const checkStorage = () => {
    const pk = secureLocalStorage.getItem(pkLocalStorageIdentifier);
    console.log(`useOneCTWallet-pkLocalStorageIdentifier: `, pk);
    setPk(pk);
  };
  useEffect(() => {
    checkStorage();
  }, [address]);

  const generatePk = useCallback(async () => {
    setCreateLoading(true);
    const message = 'I am creating 1 Click Trading account on Buffer Finance';
    try {
      const signature = await signer!.signMessage(message);
      const privateKey = ethers.utils.keccak256(signature).slice(2);
      secureLocalStorage.setItem(pkLocalStorageIdentifier, privateKey);
      checkStorage();
    } catch (e) {}
    setCreateLoading(false);
  }, [signer]);
  return {
    oneCtPk,
    createLoading,
    generatePk,
    registeredOneCT,
    registerOneCt: 'registerAccount',
    oneCTWallet,
  };
};

export { useOneCTWallet };
