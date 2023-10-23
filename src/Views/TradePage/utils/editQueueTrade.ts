import axios from 'axios';
import { baseUrl } from '../config';

const editQueueTrade = async (
  user_signature: string,
  queue_id: number | string,
  signature_timestamp: number,
  strike: string,
  period: number,
  partial_signature: string,
  full_signature: string,
  user_address: string,
  slippage: number,
  is_above: boolean,
  limit_order_duration: number,
  environment: number,
  settlement_fee: string,
  settlement_fee_sign_expiration: number,
  settlement_fee_signature: string
) => {
  const params = {
    user_signature,
    queue_id,
    signature_timestamp,
    strike,
    period,
    partial_signature,
    full_signature,
    user_address,
    slippage,
    is_above,
    limit_order_duration,
    environment,
    settlement_fee,
    settlement_fee_sign_expiration,
    settlement_fee_signature,
  };

  return await axios.get(`${baseUrl}trade/edit/`, {
    params,
  });
};

export default editQueueTrade;
