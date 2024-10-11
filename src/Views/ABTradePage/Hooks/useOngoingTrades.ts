import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import { aboveBelowMarketsAtom } from '@Views/AboveBelow/atoms';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import useSWR from 'swr';
import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { getSingatureCached } from '../cache';
import { refreshInterval, aboveBelowBaseUrl } from '../config';
import { TradeType } from '../type';
import { addMarketInTrades } from '../utils';
import { useState } from 'react';
export enum TradeState {
  Queued = 'QUEUED',
  Active = 'ACTIVE',
}
const mockResoponseAB = [
  {
    id: '24529',
    signature_timestamp: 1725517253,
    queued_timestamp: 1725517257,
    queue_id: 24300,
    strike: 5706914250000,
    period: 900,
    target_contract: '0x5647FE1e071D583D5d0772a48737f02Fb2039745',
    user_partial_signature:
      '0x3472f027f36419a4885cc4e87e417fbea283a8678fec9edcca34fc6901e11aa25565b77c69aa39740a3327bd08d6b28825a4a2523a81714c5dd1718cf6d10c1a1c',
    user_full_signature:
      '0x65fae7fbe9406f54a6c0474f915acda3a00aadf014d0c7b3771c350908258b4d292c01cbb498bfe4b22570347da194072819ec39ca47d84ef4ddd729a5016e5c1b',
    user_address: '0x0CB8D067bb7bA1D44edc95F96A86196C6C7adFA6',
    trade_size: '1000000000000000000',
    allow_partial_fill: true,
    referral_code: '',
    trader_nft_id: 0,
    slippage: 5,
    settlement_fee: 1500,
    settlement_fee_sign_expiration: 1725517358,
    settlement_fee_signature:
      '0x5379d51e6018ae12ba8c931658315168ff6d6aad0ae91cf15955da6ddd547502619833bd055fdf37b45e28160772384addc1a70c9de785cd32dbcf8c71b6bea31b',
    expiration_time: 1725518157,
    is_above: true,
    state: 'QUEUED',
    option_id: 1557,
    is_limit_order: false,
    limit_order_expiration: 1725517257,
    environment: '42161',
    expiry_price: null,
    payout: null,
    close_time: null,
    limit_order_duration: 0,
    locked_amount: '1700000000000000002',
    is_cancelled: false,
    cancellation_reason: null,
    cancellation_timestamp: null,
    early_close_signature: null,
    user_close_timestamp: null,
    open_timestamp: 1725517257,
    token: 'ARB',
    router: '0x2BAA48961C1CD376484b601278bF7A51E94293a9',
    strike_timestamp: 1725517252,
    jackpot_amount: null,
    jackpot_txn_hash: null,
    pending_operation: null,
  },
];
const mockResponse = {
  id: '24529',
  signature_timestamp: 1725517253,
  queued_timestamp: 1725517257,
  queue_id: 24300,
  strike: 5706914250000,
  period: 900,
  target_contract: '0x5647FE1e071D583D5d0772a48737f02Fb2039745',
  user_partial_signature:
    '0x3472f027f36419a4885cc4e87e417fbea283a8678fec9edcca34fc6901e11aa25565b77c69aa39740a3327bd08d6b28825a4a2523a81714c5dd1718cf6d10c1a1c',
  user_full_signature:
    '0x65fae7fbe9406f54a6c0474f915acda3a00aadf014d0c7b3771c350908258b4d292c01cbb498bfe4b22570347da194072819ec39ca47d84ef4ddd729a5016e5c1b',
  user_address: '0x0CB8D067bb7bA1D44edc95F96A86196C6C7adFA6',
  trade_size: '1000000000000000000',
  allow_partial_fill: true,
  referral_code: '',
  trader_nft_id: 0,
  slippage: 5,
  settlement_fee: 1500,
  settlement_fee_sign_expiration: 1725517358,
  settlement_fee_signature:
    '0x5379d51e6018ae12ba8c931658315168ff6d6aad0ae91cf15955da6ddd547502619833bd055fdf37b45e28160772384addc1a70c9de785cd32dbcf8c71b6bea31b',
  expiration_time: 1725518157,
  is_above: true,
  state: 'QUEUED',
  option_id: 1557,
  is_limit_order: false,
  limit_order_expiration: 1725517257,
  environment: '42161',
  expiry_price: null,
  payout: null,
  close_time: null,
  limit_order_duration: 0,
  locked_amount: '1700000000000000002',
  is_cancelled: false,
  cancellation_reason: null,
  cancellation_timestamp: null,
  early_close_signature: null,
  user_close_timestamp: null,
  open_timestamp: 1725517257,
  token: 'ARB',
  router: '0x2BAA48961C1CD376484b601278bF7A51E94293a9',
  strike_timestamp: 1725517252,
  jackpot_amount: null,
  jackpot_txn_hash: null,
  pending_operation: null,
};
const useOngoingTrades = () => {
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address: userAddress } = useUserAccount();
  const { address } = useAccount();
  const [empty, setEmpty] = useState([]);

  const markets = useAtomValue(aboveBelowMarketsAtom);
  const { data: productNames } = useProductName();
  const { data, error } = useSWR<TradeType[]>(
    'active-trades-ab-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        if (!userAddress || !productNames) return [] as TradeType[];
        // if (
        //   ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
        //     activeChain.id as 42161
        //   )
        // )
          // return [];
        let currentUserSignature = null;
        if (userAddress === address)
          currentUserSignature = await getSingatureCached(oneCTWallet);

        const res = await axios.get(`${aboveBelowBaseUrl}trades/user/active/`, {
          params: {
            user_address: getAddress(userAddress),
            environment: activeChain.id,
            product_id: productNames['AB'].product_id,
          },
        });

        if (!res?.data?.length || !markets?.length) return empty;

        return addMarketInTrades(res.data, markets) as TradeType[];
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || empty;
};

export { useOngoingTrades };
