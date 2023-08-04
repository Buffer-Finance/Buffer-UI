import { baseUrl } from '@Views/TradePage/config';
import { useUserOneCTData } from './useOneCTWalletV2';
import { getSingatureCached } from '@Views/TradePage/cache';
import axios from 'axios';
import { getAddress } from 'viem';
import { ethers } from 'ethers';
import { atom, useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { signTypedData } from '@wagmi/core';
import { useToast } from '@Contexts/Toast';
import { appConfig } from '@Views/TradePage/config';
import { WaitToast } from '@Views/TradePage/utils';
import { getChains } from 'src/Config/wagmiClient';

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
  Registration: [
    { name: 'content', type: 'string' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

export const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

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
  return oneCTWallet.address.toLowerCase() === account.toLowerCase();
};
export const disableLoadingAtom = atom<boolean>(false);
export const createLoadingAtom = atom<boolean>(false);
export const uesOneCtActiveChain = () => {
  //react-couter cant access in the navbar. Use this hook for accessing activeChain in navbar
  const { chain } = useNetwork();
  const chains = getChains();

  return { activeChain: chain ? chain : chains[0] };
};

const useOneCTWallet = () => {
  const { address } = useAccount();
  const toastify = useToast();
  const res = useUserOneCTData();
  const [disabelLoading, setDisabelLoading] = useAtom(disableLoadingAtom);
  const [createLoading, setCreateLoading] = useAtom(createLoadingAtom);

  const { activeChain } = uesOneCtActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const provider = useProvider({ chainId: activeChain.id });

  const pkLocalStorageIdentifier = useMemo(() => {
    return 'signer-account-pk:' + address + ',nonce' + res?.nonce + ':';
  }, [address, res?.nonce]);

  const oneCtPk = useMemo(() => {
    return secureLocalStorage.getItem(pkLocalStorageIdentifier);
  }, [pkLocalStorageIdentifier, createLoading]);

  const registeredOneCT = useMemo(() => {
    if (!res?.one_ct) return false;
    return (
      oneCtPk &&
      res.one_ct.toLowerCase() !== ethers.constants.AddressZero.toLowerCase()
    );
  }, [res, res?.one_ct, res?.nonce, provider, oneCtPk]);

  const { data: signer } = useSigner({ chainId: activeChain.id });

  const oneCTWallet = useMemo(() => {
    if (!oneCtPk) return null;
    return new ethers.Wallet(
      oneCtPk,
      provider as ethers.providers.StaticJsonRpcProvider
    );
  }, [oneCtPk, provider, registeredOneCT]);

  const generatePk = useCallback(async () => {
    if (!res)
      return toastify({
        msg: 'Unable to fetch data. Please try again later',
        type: 'error',
        id: 'unable-to-fetch-data-one_ct',
      });

    try {
      const nonce = res?.nonce;
      if (nonce === undefined) return toastify(WaitToast());
      setCreateLoading(true);
      const signature = await signTypedData({
        types,
        domain,
        value: {
          content: 'I want to create a trading account with Buffer Finance',
          nonce,
        },
      });
      const privateKey = ethers.utils.keccak256(signature).slice(2);
      secureLocalStorage.setItem(pkLocalStorageIdentifier, privateKey);
      setCreateLoading(false);
      if (is1CTEnabled(res.one_ct, privateKey, provider, 'one-ct-deb')) {
        toastify({
          msg: 'You have already registered your 1CT Account. You can start trading now!',
          type: 'success',
        });
        return privateKey;
      }
    } catch (e) {
      console.log(e, 'error generating signature');
      setCreateLoading(false);
      return '';
    }
  }, [signer, res?.one_ct, provider]);

  const deleteOneCTPk = () => {
    secureLocalStorage.removeItem(pkLocalStorageIdentifier);
  };
  const disableOneCt = async () => {
    try {
      setDisabelLoading(true);
      if (!res)
        return toastify({
          msg: 'Unable to fetch data. Please try again later',
          type: 'error',
          id: 'unable-to-fetch-data-one_ct',
        });
      if (typeof oneCtPk !== 'string')
        return toastify({
          msg: 'Please create your 1CT Account first',
          type: 'error',
          id: 'oneCtPk',
        });
      const types = {
        EIP712Domain,
        DeregisterAccount: [
          { name: 'user', type: 'address' },
          { name: 'nonce', type: 'uint256' },
        ],
      };
      const domain = {
        name: 'Validator',
        version: '1',
        chainId: activeChain.id,
        verifyingContract: getAddress(configData.signer_manager),
      };

      const signature = await signTypedData({
        value: {
          user: address,
          nonce: res?.nonce,
        },
        types,
        domain,
      });

      if (!signature)
        return toastify({
          msg: 'Error getting signature. Please try again later.',
          type: 'error',
          id: 'signature',
        });

      const api_signature = await getSingatureCached(oneCTWallet);

      if (!api_signature)
        return toastify({
          msg: 'Error getting signature. Please try again later.',
          type: 'error',
          id: 'signature',
        });

      const apiParams = {
        account: address,
        deregistration_signature: signature,
        environment: activeChain.id,
        api_signature,
      };
      const resp = await axios.post(baseUrl + 'deregister/', null, {
        params: apiParams,
      });

      console.log(resp, 'resp');
    } catch (e) {
      console.log(e, 'deregister api error');
      toastify({
        msg: `Error in deregister API. please try again later. ${e}`,
        type: 'error',
        id: 'deregisterapi',
      });
    }
    setDisabelLoading(false);
  };
  return {
    oneCtPk,
    oneCtAddress: res?.one_ct,
    createLoading,
    generatePk,
    disabelLoading,
    registeredOneCT,
    oneCTWallet,
    deleteOneCTPk,
    disableOneCt,
    nonce: res?.nonce,
    state: res?.state,
  };
};

export { useOneCTWallet };
