import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';

export const postQueuedId = async (queuedId?: string | number) => {
  if (!queuedId) return;
  axios.post(baseUrl + 'txnHashTrade/', null, {
    params: { txnHash: queuedId },
  });
};
