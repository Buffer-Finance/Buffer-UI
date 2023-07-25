import { useToast } from '@Contexts/Toast';

import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { cancelQueueTrade } from '../utils';
import { getSingatureCached } from '../cahce';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { TradeType, marketType, poolInfoType } from '../type';
import { ethers } from 'ethers';
import { arrayify } from 'ethers/lib/utils.js';
import axios from 'axios';
import { appConfig, baseUrl } from '../config';
import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  SetShareBetAtom,
  SetShareStateAtom,
  closeLoadingAtom,
  shareSettingsAtom,
} from '../atoms';
import { privateKeyToAccount } from 'viem/accounts';
import { getExpireNotification } from '../utils/getExpireNotification';
import { usePoolInfo } from './usePoolInfo';
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

  const setLoading = useSetAtom(closeLoadingAtom);
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
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

    setLoading((t) => ({ ...t, [trade.queue_id]: 1 }));
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
    setLoading((t) => ({ ...t, [trade.queue_id]: null }));
  };

  const earlyCloseHandler = async (
    trade: TradeType,
    tradeMarket: marketType
  ) => {
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
    console.log(
      `ec-deb: `,
      message,
      domain,
      closeSignaturePrimaryType,
      CloseAnytimeSignatureTypes
    );
    const wallet = privateKeyToAccount(`0x${oneCtPk}`);
    const actualSignature = await wallet.signTypedData({
      types: {
        EIP712Domain,
        [closeSignaturePrimaryType]: CloseAnytimeSignatureTypes,
      },
      primaryType: closeSignaturePrimaryType,
      domain,
      message,
    });
    // console.log(`actualSignature: `, actualSignature);
    const signature = await getSingatureCached(oneCTWallet);
    const params = {
      closing_time: ts,
      queue_id: trade.queue_id,
      user_signature: actualSignature,
      environment: activeChain.id,
    };

    const res = await axios.get(`${baseUrl}trade/close/`, { params });
    const updatedTrade = res.data;
    const pool = getPoolInfo(trade.pool.pool);
    await getExpireNotification(
      { ...updatedTrade, market: trade.market, pool: trade.pool },
      toastify,
      openShareModal,
      pool,
      showSharePopup,
      true
    );

    console.log(`res-cancel: `, res);
    // setLoading((t) => ({ ...t, [trade.queue_id]: 2 }));

    // setEarlyCloseLoading(null);
  };

  return { cancelHandler, earlyCloseHandler, earlyCloseLoading };
};
