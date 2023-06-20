import { useToast } from '@Contexts/Toast';

import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { cancelQueueTrade } from '../utils';
import { getSingatureCached } from '../cahce';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';

export const useCancelTradeFunction = () => {
  const { address } = useAccount();
  const toastify = useToast();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const cancelHandler = async (
    queuedId: number,
    cancelLoading: number | null,
    setCancelLoading: (newValue: number | null) => void
  ) => {
    if (!address) return;
    if (cancelLoading)
      return toastify({
        msg: 'Please wait for prev transaction.',
        type: 'error',
        id: '232',
      });
    setCancelLoading(queuedId);
    const signature = await getSingatureCached(oneCTWallet);
    if (!signature)
      return toastify({
        msg: 'Please activate your account first',
        type: 'error',
        id: '2311',
      });
    const res = await cancelQueueTrade({
      user_signature: signature,
      user_address: address,
      environment: activeChain.id,
      queue_id: queuedId,
    });
    setCancelLoading(null);
  };

  return { cancelHandler };
};
