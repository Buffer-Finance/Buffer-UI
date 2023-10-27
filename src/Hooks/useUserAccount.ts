import { userAtom } from '@Views/NoLoss-V3/atoms';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from './useQuery';

export const useUserAccount = () => {
  const { address: account } = useAccount();
  const query = useQuery();
  const setUser = useSetAtom(userAtom);
  useEffect(() => {
    const urlAddress = query.get('user_address');
    setUser({
      userAddress: urlAddress || account,
      viewOnlyAddress: urlAddress,
      isViewOnlyMode: urlAddress ? true : false,
    });
  }, [account, query]);
  return {
    address: query.get('user_address') || account,
    viewOnlyMode: query?.get('user_address') ? true : false,
  };
};
