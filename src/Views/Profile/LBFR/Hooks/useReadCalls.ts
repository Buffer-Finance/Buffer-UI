import { erc20ABI, useAccount } from 'wagmi';
import { getContract } from '../Config/Addresses';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useMemo } from 'react';
import { useReadCall } from '@Utils/useReadCall';

export const useLBLPreadCalls = () => {
  const { address: account } = useAccount();
  const { activeChain } = useActiveChain();

  const calls = useMemo(() => {
    let res: null | {
      [key: string]: { address: string; abi: any; name: string; params: any[] };
    } = null;
    if (account) {
      try {
        res = {
          userLBPLbalance: {
            address: getContract(activeChain.id, 'LBFR'),
            abi: erc20ABI,
            name: 'balanceOf',
            params: [account],
          },
        };
      } catch (e) {
        console.log(e, 'LBFR readcalls error');
      }
    }
    if (res !== null) return Object.values(res);
    return res;
  }, [account, activeChain]);

  const { data } = useReadCall({
    contracts: calls,
    swrKey: 'useLBLPreadCalls',
  });

  let response: null | { userBalance: string } = null;
  if (data) {
    response = {
      userBalance: data[0][0],
    };
  }
  console.log(calls, data, response, 'calls');
  return response;
};
