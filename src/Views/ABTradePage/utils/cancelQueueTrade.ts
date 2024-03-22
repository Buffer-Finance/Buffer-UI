import axios from 'axios';
import { baseUrl } from '../config';

const cancelQueueTrade = async (params: {
  user_signature: string;
  user_address: `0x${string}`;
  environment: number;
  queue_id: number;
}) => {
  return await axios.post(`${baseUrl}trade/cancel/`, null, { params });
};

export default cancelQueueTrade;
