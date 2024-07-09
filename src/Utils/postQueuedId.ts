import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';

export const postQueuedId = async (
  queuedId: string | number | null | undefined,
  product: 'UD' | 'AB'
) => {
  if (!queuedId) return;
  axios.post(baseUrl + 'txnHashTrade/', null, {
    params: { txnHash: queuedId + ':' + product },
  });
};
