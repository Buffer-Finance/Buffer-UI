import { useActiveChain } from '@Hooks/useActiveChain';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import { activeAssetStateAtom } from '@Views/BinaryOptions';
import { ethers } from 'ethers';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useAccount, useProvider, useSigner, useSignTypedData } from 'wagmi';
import { signTypedData } from '@wagmi/core';
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

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 421613,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const;

// The named list of all type definitions
const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  one_ct: [
    { name: 'content', type: 'string' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

const message = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
} as const;

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
  if (deb)
    console.log(
      deb,
      oneCTWallet.address,
      account,
      oneCTWallet.address.toLowerCase() === account.toLowerCase()
    );

  return oneCTWallet.address.toLowerCase() === account.toLowerCase();
};
export const disableLoadingAtom = atom<boolean>(false);

const useOneCTWallet = () => {
  const { address } = useAccount();
  const { writeCall } = useIndependentWriteCall();
  const toastify = useToast();
  const res = useAccountMapping();
  const [disabelLoading, setDisabelLoading] = useAtom(disableLoadingAtom);
  const [createLoading, setCreateLoading] = useState(false);

  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const provider = useProvider({ chainId: activeChain.id });
  const pkLocalStorageIdentifier = useMemo(() => {
    return 'signer-account-pk:' + address + ',nonce' + res?.[1] + ':';
  }, [address, res?.[1]]);
  const oneCtPk = useMemo(() => {
    return secureLocalStorage.getItem(pkLocalStorageIdentifier);
  }, [pkLocalStorageIdentifier, createLoading]);
  console.log(`useOneCTWallet-oneCtPk: `, oneCtPk);
  const registeredOneCT = useMemo(() => {
    const isEnabled =
      res?.length && pkLocalStorageIdentifier
        ? is1CTEnabled(
            res[0],
            secureLocalStorage.getItem(pkLocalStorageIdentifier) || '',
            provider,
            'deb-1ct-1'
          )
        : false;
    return isEnabled;
  }, [res, res?.[0], res?.[1], provider, oneCtPk]);
  const { data: signer } = useSigner({ chainId: activeChain.id });
  const oneCTWallet = useMemo(() => {
    if (!oneCtPk) return null;
    return new ethers.Wallet(
      oneCtPk,
      provider as ethers.providers.StaticJsonRpcProvider
    );
  }, [oneCtPk, provider, registeredOneCT]);
  // console.log(`useOneCTWallet-data: `, oneCTWallet);
  useEffect(() => {
    const localPk = secureLocalStorage.getItem(
      pkLocalStorageIdentifier
    ) as string;
    console.log(`deb-1ct-1: `, localPk);
  }, [pkLocalStorageIdentifier]);

  const generatePk = useCallback(async () => {
    setCreateLoading(true);
    const nonce = res?.[1];
    if (!nonce) return toastify(WaitToast());
    // try {
    const signature = await signTypedData({
      types,
      domain,
      value: {
        content: 'I want to create 1ct ',
        nonce,
      },
    });
    console.log(`useOneCTWallet-signature: `, signature);
    const privateKey = ethers.utils.keccak256(signature).slice(2);
    console.log(`deb-1ct: `, privateKey, pkLocalStorageIdentifier);
    secureLocalStorage.setItem(pkLocalStorageIdentifier, privateKey);
    setCreateLoading(false);
    if (is1CTEnabled(res[0], privateKey, provider, 'one-ct-deb')) {
      toastify({
        msg: 'You have already registered your 1CT Account. You can start trading now!',
        type: 'success',
      });
    }
    return privateKey;
  }, [signer, res?.[0], provider]);
  const deleteOneCTPk = () => {
    secureLocalStorage.removeItem(pkLocalStorageIdentifier);
  };
  const disableOneCt = () => {
    setDisabelLoading(true);
    writeCall(
      configData.signer_manager,
      SignerManagerABI,
      (payload) => {
        setDisabelLoading(false);

        if (payload.payload) {
          toastify({
            msg: '1 Click Trading is now disablted.',
            type: 'success',
          });
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
    disabelLoading,
    registeredOneCT,
    registerOneCt: registerOneCtMethod,
    oneCTWallet,
    deleteOneCTPk,
    disableOneCt,
    accountMapping: res,
  };
};

export { useOneCTWallet };
