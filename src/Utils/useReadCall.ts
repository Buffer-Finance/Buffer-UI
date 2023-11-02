import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { activeChainAtom, userAtom } from '@Views/NoLoss-V3/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { createPublicClient, http } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { multicallv2 } from './Contract/multiContract';
import getDeepCopy from './getDeepCopy';
import { viemMulticall } from './multicall';

export const useReadCall = ({
  contracts,
  swrKey,
}: {
  contracts: any;
  swrKey: string;
}) => {
  const calls = contracts;
  const { activeChain, isWrongChain, chainInURL } = useActiveChain();
  const { address: account } = useUserAccount();
  const { data: signer } = useWalletClient({ chainId: activeChain.id });
  const { address } = useAccount();
  const { cache } = useSWRConfig();
  const p = usePublicClient({ chainId: activeChain.id });
  const configContracts = getConfig(activeChain.id);
  let signerOrProvider = p;

  if (signer && !isWrongChain && address) {
    signerOrProvider = signer;
  }
  // console.log(signerOrProvider?._network?.chainId, activeChain, 'provider');
  const key = swrKey + activeChain.id + account + chainInURL;

  // console.log(`signerOrProvider: `, signerOrProvider);
  return useSWR(calls && calls.length ? key : null, {
    fetcher: async () => {
      if (!calls) return null;
      let returnData = await multicallv2(
        calls,
        signerOrProvider,
        configContracts.multicall,
        swrKey + activeChain.id + account
      );
      if (returnData) {
        let copy = getDeepCopy(returnData);
        convertBNtoString(copy);
        return copy;
      }
      // console.log(returnData, swrKey, cache.get(key), 'returnData');
      return cache.get(key);
    },
    // refreshInterval: 500,
  });
};
export const useCall2Data = (contracts: any, swrKey: string) => {
  const calls = contracts;
  // const { activeChain, isWrongChain, chainInURL } = useActiveChain();
  // const { address: account } = useUserAccount();
  const user = useAtomValue(userAtom);
  const activeChain = useAtomValue(activeChainAtom);
  const { cache } = useSWRConfig();
  const key = swrKey + activeChain?.id + user?.userAddress;

  const client = useMemo(() => {
    return createPublicClient({
      chain: activeChain,
      transport: http(),
    });
  }, [activeChain]);

  return useSWR(calls && calls.length ? key : null, {
    fetcher: async () => {
      if (!calls) return null;
      let returnData = await viemMulticall(
        calls,
        client,
        swrKey + activeChain?.id + user?.userAddress
      );
      return returnData || cache.get(key);
    },
    refreshInterval: 900,
  });
};

export function convertBNtoString(data) {
  if (!data) return;

  Object.keys(data)?.forEach((key) => {
    if (typeof data[key] === 'object' && data[key] && !data[key].type) {
      convertBNtoString(data[key]);
    }

    if (typeof data[key] == 'bigint') {
      data[key] = data[key].toString();
    }
  });
}

export const contractRead = async (contract, method, args, debug = false) => {
  if (debug) {
    console.log(`${method}-contract: `, contract);
    console.log(`${method}-fn: `, contract[method]);
    console.log(`method: `, method);
    console.log(`args: `, args);
  }
  const res = await contract[method](...args);
  let copy = getDeepCopy(res);
  convertBNtoString(copy);
  if (debug) {
    console.log(`${method}-res: `, copy);
    console.log(`${method}-arg: `, args);
  }
  return copy;
};

export const useSignerOrPorvider = () => {
  const { address } = useAccount();
  const { activeChain, isWrongChain } = useActiveChain();

  const { data: signer } = useWalletClient({ chainId: activeChain.id });

  const p = usePublicClient({ chainId: activeChain.id });
  const signerOrProvider = useMemo(() => {
    let signerOrProvider = p;

    if (signer && !isWrongChain && address) {
      signerOrProvider = signer;
    }
    return signerOrProvider;
  }, [p, signer]);
  return signerOrProvider;
};
