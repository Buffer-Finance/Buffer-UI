import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer } from 'ethers';
import { OngoingTradeSchema } from '../type';
import { getSingatureCached } from '../cahce';

const usePlatformTrades = () => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const { data, error } = useSWR<OngoingTradeSchema[][]>(
    'platform-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        const signature = await getSingatureCached(oneCTWallet);
        console.log(`ssssignature: `, signature);
        const response = await Promise.all([
          axios.get(`${baseUrl}trades/all_active/`, {
            params: {
              user_signature: signature,
              user_address: address,
              environment: activeChain.id,
            },
          }),
          axios.get(`${baseUrl}trades/all_history/`, {
            params: {
              user_signature: signature,
              user_address: address,
              environment: activeChain.id,
            },
          }),
        ]);
        const [activeTrades, limitOrders] = response.map((r) => r.data);
        return [activeTrades, limitOrders] as OngoingTradeSchema[];
      },
      refreshInterval: 10,
    }
  );
  return data || ([[], []] as OngoingTradeSchema[][]);
};

export { usePlatformTrades };
