import { useAccount } from 'wagmi';
const query = new URLSearchParams(window.location.search);

export const useUserAccount = () => {
  const { address: account } = useAccount();
  return {
    address: query.get('user_address') || account,
    viewOnlyMode: query?.get('user_address') ? true : false,
  };
};
