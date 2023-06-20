import { useToast } from '@Contexts/Toast';

import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { cancelQueueTrade } from '../utils';
import { getSingatureCached } from '../cahce';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { OngoingTradeSchema, marketType } from '../type';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';
import axios from 'axios';
import { baseUrl } from '../config';
import { useState } from 'react';

export const useCancelTradeFunction = () => {
  const { address } = useAccount();
  const toastify = useToast();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const [earlyCloseLoading, setEarlyCloseLoading] = useState<number | null>(
    null
  );
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

  const earlyCloseHandler = async (
    trade: OngoingTradeSchema,
    tradeMarket: marketType
  ) => {
    const ts = Math.round(Date.now() / 1000);
    setEarlyCloseLoading(trade.queue_id);
    const hashedMessage = ethers.utils.solidityKeccak256(
      ['string', 'uint256', 'uint256'],
      [tradeMarket.tv_id, ts, trade.option_id]
    );
    console.log(`ec-hashedMessage: `, hashedMessage);
    const signature = await oneCTWallet?.signMessage(arrayify(hashedMessage));
    const params = {
      closing_time: ts,
      queue_id: trade.queue_id,
      user_signature: signature,
      environment: activeChain.id,
    };
    console.log(`ec-params: `, params);
    const res = await axios.get(`${baseUrl}trade/cancel/`, { params });
    setEarlyCloseLoading(null);
  };

  return { cancelHandler, earlyCloseHandler, earlyCloseLoading };
};
