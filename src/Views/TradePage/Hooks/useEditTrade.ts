import { multiply } from '@Utils/NumString/stringArithmatics';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useAccount } from 'wagmi';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getSingatureCached } from '../cache';
import {
  HHMMToSeconds,
  editQueueTrade,
  generateTradeSignature,
} from '../utils';

export const useEditTrade = () => {
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const toastify = useToast();
  const { activeChain } = useActiveChain();
  const editTrade = async (
    size: string,
    durationInHHMM: string,
    targetContract: string,
    price: string,
    slippage: string,
    partialFill: boolean,
    referral: string,
    NFTid: string,
    settlementFee: string | number,
    isUp: boolean,
    limitOrderDurationInSeconds: number,
    queue_id: number
  ) => {
    const durationInSeconds = HHMMToSeconds(durationInHHMM);
    if (!oneCTWallet || !address)
      return toastify({
        msg: 'Something went wrong',
        type: 'errror',
        id: 'dsfs',
      });
    const strike = multiply(price, 8);
    const ts = Math.round(Date.now() / 1000);
    const currentTs = Math.round(Date.now() / 1e3);
    const signs = await generateTradeSignature(
      address,
      size,
      durationInSeconds,
      targetContract,
      strike,
      slippage,
      partialFill,
      referral,
      NFTid,
      ts,
      settlementFee,
      isUp,
      oneCTWallet
    );
    console.log(`index-duration-signs: `, signs);
    const signature = await getSingatureCached(oneCTWallet);

    const res = await editQueueTrade(
      signature,
      queue_id,
      currentTs,
      strike,
      durationInSeconds,
      signs[0],
      signs[1],
      address,
      +slippage,
      isUp,
      limitOrderDurationInSeconds,
      activeChain.id
    );
    if (res) {
      return toastify({
        msg: 'Limit order updated successfully',
        type: 'success',
        id: '211',
      });
    }
  };

  return editTrade;
};
