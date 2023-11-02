import { userAtom } from '@Views/NoLoss-V3/atoms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from './useQuery';

export const useUserAccount = () => {
  const { address: account } = useAccount();
  const query = useQuery();
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const urlAddress = query.get('user_address');
    setUser({
      userAddress: urlAddress || account,
      viewOnlyAddress: urlAddress,
      isViewOnlyMode: urlAddress ? true : false,
      connectedWalletAddress: account,
    });
  }, [account, query]);
};
