import { useActiveChain } from '@Hooks/useActiveChain';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useAccount } from 'wagmi';
import { getConfig } from './getConfig';
import { useToast } from '@Contexts/Toast';
import { TradeType } from '../type';
import { multiply, round } from '@Utils/NumString/stringArithmatics';
import { generateBuyTradeSignature } from './generateTradeSignature';
import { getSingatureCached } from '../cache';
import editQueueTrade from './editQueueTrade';
import { useAtom, useSetAtom } from 'jotai';
import { rerenderPositionAtom } from '../atoms';
import { loeditLoadingAtom } from '../Views/EditModal';
import { sleep } from '@TV/useDataFeed';

const useLimitOrderHandlers = () => {
  const { activeChain } = useActiveChain();
  const [editLoading, setEditLoading] = useAtom(loeditLoadingAtom);

  const { oneCtPk, oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const configData = getConfig(activeChain.id);
  const toastify = useToast();
  const setPositionRerender = useSetAtom(rerenderPositionAtom);
  const revokeGraphChange = () => {
    // if api fails
    setPositionRerender((p) => p + 1);
  };
  const changeStrike = async (trade: TradeType, strike: string) => {
    try {
      setEditLoading(trade.queue_id);
      const currentTs = Math.round(Date.now() / 1000);
      const expandedStrike = round(multiply(strike, 8), 0)!;
      const signs = await generateBuyTradeSignature(
        address,
        trade.trade_size + '',
        +trade.period / 60,
        trade.target_contract,
        strike,
        trade.slippage + '',
        trade.allow_partial_fill,
        trade.referral_code,
        trade.trader_nft_id + '',
        currentTs,
        0,
        trade.is_above,
        oneCtPk,
        activeChain.id,
        configData.router
      );
      const signature = await getSingatureCached(oneCTWallet);
      if (!signature)
        return toastify({
          msg: 'Please activate your account first!',
          type: 'error',
          id: '1231',
        });
      const res = await editQueueTrade(
        signature,
        trade.queue_id,
        currentTs,
        expandedStrike,
        trade.period,
        signs[0],
        signs[1],
        address,
        trade.slippage,
        trade.is_above,
        trade.limit_order_duration,
        activeChain.id
      );
      if (res) {
        // toastify({
        //   msg: 'Limit order strike updated successfully!',
        //   type: 'success',
        //   id: '132132123',
        // });
      } else {
        revokeGraphChange();
      }
      await sleep(1000);
      setEditLoading(null);
    } catch (e) {
      revokeGraphChange();
      console.log('lo-edit::erro', e);
    }
  };
  return { changeStrike };
};

export { useLimitOrderHandlers };
