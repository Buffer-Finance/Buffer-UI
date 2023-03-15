import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { multicallv2 } from './Contract/multiContract';
import getDeepCopy from './getDeepCopy';

export const useReadCall = ({
  contracts,
  swrKey,
}: {
  contracts: any[];
  swrKey: string;
  chainName: string | undefined;
}) => {
  const calls = contracts;
  const params = useParams();
  const chainName = params.chain;
  const { activeChain, isWrongChain, configContracts } =
    useActiveChain(chainName);
  const { address: account } = useUserAccount();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { cache } = useSWRConfig();
  const p = useProvider({ chainId: activeChain.id });
  let signerOrProvider = p;

  if (!chainName || (signer && !isWrongChain && address)) {
    signerOrProvider = signer;
  }
  // console.log(signerOrProvider?._network?.chainId, 'provider');
  const key = swrKey + activeChain.id + account + chainName;

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

export function convertBNtoString(data) {
  if (!data) return;

  Object.keys(data)?.forEach((key) => {
    if (typeof data[key] === 'object' && data[key] && !data[key].type) {
      convertBNtoString(data[key]);
    }

    if (data[key] && data[key]?._isBigNumber) {
      data[key] = ethers.utils.formatUnits(data[key]._hex, 0);
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
