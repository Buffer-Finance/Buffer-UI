import { useAccount } from 'wagmi';
import { useQuery } from './useQuery';

export const useUserAccount = () => {
  const { address: account } = useAccount();
  const query = useQuery();
  return {
    address: "0x000000e28fAA823d5B53ff6C2922c28335840375",
    viewOnlyMode: query?.get('user_address') ? true : false,
  };
};
