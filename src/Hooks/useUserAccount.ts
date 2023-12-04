import { userAtom } from '@Views/NoLoss-V3/atoms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from './useQuery';
import { useSmartAccount } from './AA/useSmartAccount';

export const useUserAccount = () => {
  const { address: account } = useAccount();
  const query = useQuery();
  const [user, setUser] = useAtom(userAtom);
  const { smartAccount } = useSmartAccount();
  // console.log(`smartWalletAddress: `, smartWalletAddress);
  useEffect(() => {
    const urlAddress = query.get('user_address');
    setUser({
      userAddress: urlAddress || smartAccount?.address || account,
      viewOnlyAddress: urlAddress,
      isViewOnlyMode: urlAddress ? true : false,
      connectedWalletAddress: account,
      mainEOA: account,
    });
  }, [account, query, smartAccount]);
};
