import { userAtom } from '@Views/NoLoss-V3/atoms';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from './useQuery';
import { useSmartWallet } from './AA/useSmartWallet';

export const useUserAccount = () => {
  const { address: account } = useAccount();
  const query = useQuery();
  const [user, setUser] = useAtom(userAtom);
  const { smartWalletAddress } = useSmartWallet();
  // console.log(`smartWalletAddress: `, smartWalletAddress);
  useEffect(() => {
    const urlAddress = query.get('user_address');
    setUser({
      userAddress: urlAddress || smartWalletAddress || account,
      viewOnlyAddress: urlAddress,
      isViewOnlyMode: urlAddress ? true : false,
      connectedWalletAddress: account,
    });
  }, [account, query, smartWalletAddress]);
};
