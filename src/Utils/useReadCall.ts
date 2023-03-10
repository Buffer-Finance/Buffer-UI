import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { multicallv2 } from './Contract/multiContract';
import getDeepCopy from './getDeepCopy';
export const useReadCall = ({ contracts }) => {
  const calls = contracts;
  const { data: signer } = useSigner();
  const {isWrongChain} = useActiveChain();
  const {address} = useAccount();
  const p = useProvider();
  let signerOrProvider = p;
  if(signer && !isWrongChain && address ) {
    signerOrProvider = signer;
  }
  return useSWR(calls && [calls], {
    fetcher: async (calls) => {
      if (!calls) return null;
      let returnData = await multicallv2(calls,signerOrProvider );
      if (returnData) {
        let copy = getDeepCopy(returnData);
        convertBNtoString(copy);
        return copy;
      }
      return null;
    },
    refreshInterval: 500,
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
