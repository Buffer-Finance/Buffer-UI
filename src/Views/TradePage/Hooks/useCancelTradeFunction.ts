import { useToast } from '@Contexts/Toast';

import { useAccount } from 'wagmi';
import { signatureCache } from './useOngoingTrades';
import { useActiveChain } from '@Hooks/useActiveChain';
import { cancelQueueTrade } from '../utils';

export const useCancelTradeFunction = () => {
  const { address } = useAccount();
  const toastify = useToast();
  const { activeChain } = useActiveChain();

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
    const res = await cancelQueueTrade({
      user_signature: signatureCache,
      user_address: address,
      environment: activeChain.id,
      queue_id: queuedId,
    });
    setCancelLoading(null);
  };

  return { cancelHandler };
};
