import { useActiveChain } from '@Hooks/useActiveChain';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import { activeAssetStateAtom, useQTinfo } from '@Views/BinaryOptions';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useAccount, useProvider, useSigner } from 'wagmi';
import RouterAbi from '@Views/BinaryOptions/ABI/routerABI.json';
import { useToast } from '@Contexts/Toast';
const registerOneCtMethod = 'registerAccount';
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

  return oneCTWallet.address.toLowerCase() === account[0].toLowerCase();
};

const useOneCTWallet = () => {
  const { address } = useAccount();
  const { writeCall } = useIndependentWriteCall();
  const toastify = useToast();
  const qtInfo = useQTinfo();
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
    setPk(pk);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      checkStorage();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [address]);

  const generatePk = useCallback(async () => {
    setCreateLoading(true);
    const message = 'I am creating 1 Click Trading account on Buffer Finance';
    try {
      const signature = await signer!.signMessage(message);
      const privateKey = ethers.utils.keccak256(signature).slice(2);
      secureLocalStorage.setItem(pkLocalStorageIdentifier, privateKey);
      checkStorage();
      return privateKey;
    } catch (e) {}
    setCreateLoading(false);
  }, [signer]);
  const deleteOneCTPk = () => {
    secureLocalStorage.removeItem(pkLocalStorageIdentifier);
    checkStorage();
  };
  const disableOneCt = () => {
    writeCall(
      qtInfo.routerContract,
      RouterAbi,
      (payload) => {
        if (payload.payload) {
          toastify({
            msg: '1 Click Trading is now disablted.',
            type: 'success',
          });
          deleteOneCTPk();
          checkStorage();
        }
      },
      registerOneCtMethod,
      [ethers.constants.AddressZero]
    );
  };
  return {
    oneCtPk,
    createLoading,
    generatePk,
    registeredOneCT,
    registerOneCt: registerOneCtMethod,
    oneCTWallet,
    deleteOneCTPk,
    disableOneCt,
  };
};

export { useOneCTWallet };
