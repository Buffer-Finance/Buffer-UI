import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { appConfig } from '@Views/TradePage/config';
import { useActiveChain } from '@Hooks/useActiveChain';
import RouterABI from '@Views/TradePage/ABIs/RouterABI.json';
import { useUserAccount } from '@Hooks/useUserAccount';

const useAccountMapping = () => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

  const calls = {
    address: configData.router,
    abi: RouterABI,
    name: 'accountMapping',
    params: [address],
  };

  // const { data } =
};

export default useAccountMapping;
