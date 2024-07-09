import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';

export const postQueuedId = async (
  queuedId: string | number | null | undefined,
  product: string
) => {
  if (!queuedId) return;
  axios.post(baseUrl + 'txnHashTrade/', null, {
    params: { txnHash: product + ':' + queuedId },
  });
};
