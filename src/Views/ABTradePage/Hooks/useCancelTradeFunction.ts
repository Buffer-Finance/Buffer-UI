import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { sleep } from '@TV/useDataFeed';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  SetShareBetAtom,
  SetShareStateAtom,
  closeLoadingAtom,
  shareSettingsAtom,
} from '../atoms';
import { getSingatureCached } from '../cache';
import { baseUrl } from '../config';
import { TradeType, marketType, poolInfoType } from '../type';
import { cancelQueueTrade } from '../utils';
import { getWalletFromOneCtPk } from '../utils/generateTradeSignature';
import { getConfig } from '../utils/getConfig';
import { getExpireNotification } from '../utils/getExpireNotification';
import { usePoolInfo } from './usePoolInfo';
import { useProducts } from '@Views/AboveBelow/Hooks/useProductName';
const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];
const CloseAnytimeSignatureTypes = [
  { name: 'assetPair', type: 'string' },
  { name: 'timestamp', type: 'uint256' },
  { name: 'optionId', type: 'uint256' },
];
const closeSignaturePrimaryType = 'CloseAnytimeSignature';

export const useCancelTradeFunction = () => {
  const { address } = useAccount();
  const toastify = useToast();
  const { activeChain } = useActiveChain();
  const { oneCTWallet, oneCtPk } = useOneCTWallet();
  const { showSharePopup } = useAtomValue(shareSettingsAtom);
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);
  const { getPoolInfo } = usePoolInfo();
  const products = useProducts();
  const setLoading = useSetAtom(closeLoadingAtom);
  const configData = getConfig(activeChain.id);
  const openShareModal = (
    trade: TradeType,
    expiry: string,
    market: marketType,
    poolInfo: poolInfoType
  ) => {
    if (!showSharePopup) return;
    setIsOpen(true);
    setBet({ trade, expiryPrice: expiry, market, poolInfo });
  };
  const [earlyCloseLoading, setEarlyCloseLoading] = useState<{
    [queued_id: number]: boolean;
  }>({});
  const cancelHandler = async (trade: TradeType) => {
    if (!address) return;

    const signature = await getSingatureCached(oneCTWallet);
    if (!signature)
      return toastify({
        msg: 'Please activate your account first',
        type: 'error',
        id: '2311',
      });
    try {
      setLoading((t) => ({ ...t, [trade.queue_id]: 1 }));
      const res = await cancelQueueTrade({
        user_signature: signature,
        user_address: address,
        environment: activeChain.id,
        queue_id: trade.queue_id,
        product_id: products.UP_DOWN.product_id,
      });
      if (res.status === 200) {
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
    } finally {
      await sleep(3000);
      setLoading((t) => ({ ...t, [trade.queue_id]: null }));
    }
  };

  const earlyCloseHandler = async (
    trade: TradeType,
    tradeMarket: marketType
  ) => {
    try {
      console.log(`[chart-deb]tradeMarket: `, trade);

      if (trade.state.toLowerCase() === 'queued')
        throw new Error('Trade is not open yet.');
      if (trade.option_id === null) throw new Error('Option id not found.');
      if (oneCtPk === null) throw new Error('Onect wallet not found.');
      const ts = Math.round(Date.now() / 1000);
      const domain = {
        name: 'Validator',
        version: '1',
        chainId: activeChain.id,
        verifyingContract: configData.router,
      };
      setLoading((t) => ({ ...t, [trade.queue_id]: 2 }));
      const message = {
        assetPair: tradeMarket.tv_id,
        timestamp: ts,
        optionId: trade.option_id,
      };

      console.log(`[chart-deb]oneCtPk: `, oneCtPk, message);
      const wallet = getWalletFromOneCtPk(oneCtPk);
      const actualSignature = await wallet.signTypedData({
        types: {
          EIP712Domain,
          [closeSignaturePrimaryType]: CloseAnytimeSignatureTypes,
        },
        primaryType: closeSignaturePrimaryType,
        domain,
        message,
      });
      console.log(`[chart-deb]actualSignature: `, actualSignature);

      const params = {
        closing_time: ts,
        queue_id: trade.queue_id,
        user_signature: actualSignature,
        environment: activeChain.id,
      };
      console.log(`[chart-deb]params: `, params);

      const res = await axios.get(`${baseUrl}trade/close/`, { params });
      const updatedTrade = res.data;
      const pool = getPoolInfo(trade.pool.pool);
      await getExpireNotification(
        { ...updatedTrade, market: trade.market, pool: trade.pool },
        toastify,
        openShareModal,
        pool,
        showSharePopup
        // true
      );
    } catch (e) {
      toastify({
        msg: (e as any).message,
        type: 'error',
        id: '231',
      });
    }
  };

  return { cancelHandler, earlyCloseHandler, earlyCloseLoading };
};
