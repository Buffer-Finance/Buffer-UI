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
  const [earlyCloseLoading, setEarlyCloseLoading] = useState<{
    [queued_id: number]: boolean;
  }>({});
  const cancelHandler = async (
    trade: OngoingTradeSchema,
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
    setCancelLoading(trade.queue_id);
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
      queue_id: trade.queue_id,
    });
    try {
      if (res.status === 200) {
        toastify({
          msg: 'Trade cancelled successfully',
          type: 'success',
          id: trade.queue_id,
        });
      } else {
        toastify({
          msg: 'Something went wrong' + res.data.message,
          type: 'error',
          id: '231',
        });
      }
    } catch (e) {
      toastify({
        msg: 'Something went wrong' + (e as any).message,
        type: 'error',
        id: '231',
      });
    }
    setCancelLoading(null);
  };

  const earlyCloseHandler = async (
    trade: OngoingTradeSchema,
    tradeMarket: marketType
  ) => {
    const ts = Math.round(Date.now() / 1000);
    setEarlyCloseLoading((l) => ({ ...l, [trade.queue_id]: true }));
    console.log(`[tradeMarket.tv_id, ts, trade.option_id]: `, [
      tradeMarket.tv_id,
      ts,
      trade.option_id,
    ]);
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

    try {
      const res = await axios.get(`${baseUrl}trade/close/`, { params });
      if (res.status === 200) {
        toastify({
          msg: 'Trade closed successfully',
          type: 'success',
          id: trade.queue_id + 'earlyClose',
        });
      } else {
        toastify({
          msg: 'Something went wrong' + res.data.message,
          type: 'error',
          id: trade.queue_id + 'earlyClose',
        });
      }
    } catch (e) {
      toastify({
        msg: 'Something went wrong' + (e as any).message,
        type: 'error',
        id: trade.queue_id + 'earlyClose',
      });
    }

    // setEarlyCloseLoading(null);
  };

  return { cancelHandler, earlyCloseHandler, earlyCloseLoading };
};
