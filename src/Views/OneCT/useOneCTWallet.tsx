import { useActiveChain } from '@Hooks/useActiveChain';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import { activeAssetStateAtom } from '@Views/BinaryOptions';
import { ethers } from 'ethers';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useAccount, useProvider, useSigner } from 'wagmi';
import RouterAbi from '@Views/BinaryOptions/ABI/routerABI.json';
import { useToast } from '@Contexts/Toast';
import { appConfig } from '@Views/TradePage/config';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import useSWR from 'swr';
import { useCall2Data } from '@Utils/useReadCall';
import RouterABI from '@Views/BinaryOptions/ABI/routerABI.json';
import useAccountMapping from './useAccountMapping';
import { showOnboardingAnimationAtom } from '@Views/TradePage/atoms';
import { WaitToast } from '@Views/TradePage/utils';
import SignerManagerABI from '@Views/OneCT/signerManagerABI.json';

/*
 * Nonce is zero initially.
 * User singes a message with nonce 0 and from the signature, we generate PK.
 * We store the PK in local storage.
 *
 * If user uses the same main account on different hardware, the same PK will be generated,
 * Hence he doesn't have to do register txn again.
 *
 * If user deRegesters the trading account,
 *  Nonce will be incremented by 1.
 *  Account Mapping will be updated to zero address
 * Hence all the hardwares with the same main account will have to register 1CT again with the
 * new PK generated from incremented nonce
 */

const registerOneCtMethod = 'registerAccount';

export const is1CTEnabled = (
  account: string,
  pk: string | null,
  provider: any,
  deb?: string
) => {
  if (!account || !pk || !provider) return null;
  const oneCTWallet = new ethers.Wallet(
    pk,
    provider as ethers.providers.StaticJsonRpcProvider
  );
  // if (deb) console.log(deb, oneCTWallet.address, account);

  return oneCTWallet.address.toLowerCase() === account.toLowerCase();
};

const useOneCTWallet = () => {
  const { address } = useAccount();
  const { writeCall } = useIndependentWriteCall();
  const toastify = useToast();
  const res = useAccountMapping();

  const [createLoading, setCreateLoading] = useState(false);

  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const [oneCtPk, setPk] = useState<string | null>(null);
  const provider = useProvider({ chainId: activeChain.id });

  const pkLocalStorageIdentifier = 'signer-account-pk:' + address;

  const registeredOneCT = useMemo(() => {
    const isEnabled = res?.length
      ? is1CTEnabled(
          res[0],
          secureLocalStorage.getItem(pkLocalStorageIdentifier) || '',
          provider,
          'debugggging'
        )
      : false;
    return isEnabled;
  }, [res, oneCtPk, provider]);
  const { data: signer } = useSigner({ chainId: activeChain.id });
  const oneCTWallet = useMemo(() => {
    if (!oneCtPk) return null;
    return new ethers.Wallet(
      oneCtPk,
      provider as ethers.providers.StaticJsonRpcProvider
    );
  }, [oneCtPk, provider, registeredOneCT]);
  // console.log(`useOneCTWallet-data: `, oneCTWallet);

  const checkStorage = () => {
    const pk = secureLocalStorage.getItem(pkLocalStorageIdentifier) as string;
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
    const nonce = res?.[1];
    if (!nonce) return toastify(WaitToast());
    const message =
      'I am creating 1 Click Trading account on Buffer Finance ' + nonce;
    try {
      const signature = await signer!.signMessage(message);
      const privateKey = ethers.utils.keccak256(signature).slice(2);
      secureLocalStorage.setItem(pkLocalStorageIdentifier, privateKey);
      checkStorage();
      setCreateLoading(false);
      if (is1CTEnabled(res[0], privateKey, provider)) {
        toastify({
          msg: 'You have already registered your 1CT Account. You can start trading now!',
          type: 'success',
        });
      }
      return privateKey;
    } catch (e) {
      setCreateLoading(false);
    }
  }, [signer, res?.[0], provider]);
  const deleteOneCTPk = () => {
    secureLocalStorage.removeItem(pkLocalStorageIdentifier);
    checkStorage();
  };
  const disableOneCt = () => {
    writeCall(
      configData.signer_manager,
      SignerManagerABI,
      (payload) => {
        if (payload.payload) {
          toastify({
            msg: '1 Click Trading is now disablted.',
            type: 'success',
          });
          // deleteOneCTPk();
          checkStorage();
        }
      },
      'deregisterAccount',
      []
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
    accountMapping: res,
  };
};

export { useOneCTWallet };
