import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { sleep } from '@TV/useDataFeed';
import { divide, multiply, round } from '@Utils/NumString/stringArithmatics';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useAtom, useSetAtom } from 'jotai';
import { useAccount } from 'wagmi';
import { useSettlementFee } from '../Hooks/useSettlementFee';
import { loeditLoadingAtom } from '../Views/EditModal';
import { rerenderPositionAtom } from '../atoms';
import { getSingatureCached } from '../cache';
import { TradeType } from '../type';
import editQueueTrade from './editQueueTrade';
import { generateBuyTradeSignature } from './generateTradeSignature';
import { getConfig } from './getConfig';

const useLimitOrderHandlers = () => {
  const { activeChain } = useActiveChain();
  const [editLoading, setEditLoading] = useAtom(loeditLoadingAtom);
  const { data: allSettlementFees } = useSettlementFee();

  const { oneCtPk, oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const configData = getConfig(activeChain.id);
  const toastify = useToast();
  const setPositionRerender = useSetAtom(rerenderPositionAtom);
  // const { data: allSpreads } = useSpread();

  const revokeGraphChange = () => {
    // if api fails
    setPositionRerender((p) => p + 1);
  };
  const changeStrike = async (trade: TradeType, strike: string) => {
    if (!trade || !oneCTWallet || !address)
      return toastify({
        msg: 'Something went wrong',
        type: 'errror',
        id: 'dsfs',
      });

    if (!allSettlementFees) {
      return toastify({
        type: 'error',
        msg: 'There is some error while fetching the data!',
        id: 'binaryBuy',
      });
    }
    try {
      // const spread = allSpreads?.[trade.market.tv_id];
      // if (spread === undefined || spread === null) {
      //   throw new Error('Spread not found');
      // }
      setEditLoading(trade.queue_id);
      const currentTs = Math.round(Date.now() / 1000);
      const settlement_fee = trade.settlement_fee.toString();
      const bsesettelmentFeeObj =
        allSettlementFees?.[trade.is_above ? 'up' : 'down']; //FIXME use older sf signatures.
      const expandedStrike = round(multiply(strike, 8), 0)!;

      const signs = await generateBuyTradeSignature(
        address,
        trade.trade_size + '',
        divide(trade.period.toString(), '60') as string,
        trade.target_contract,
        strike,
        trade.slippage + '',
        trade.allow_partial_fill,
        trade.referral_code,
        // trade.trader_nft_id + '',
        currentTs,

        settlement_fee,
        trade.is_above!,
        oneCtPk!,
        activeChain.id,
        configData.router
        // spread.spread
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
        trade.is_above!,
        trade.limit_order_duration,
        activeChain.id,
        settlement_fee,
        bsesettelmentFeeObj.settlement_fee_sign_expiration,
        bsesettelmentFeeObj.settlement_fee_signature
        // spread.spread.toString(),
        // spread.spread_sign_expiration,
        // spread.spread_signature
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
    } catch (e) {
      revokeGraphChange();
      toastify({
        msg: 'Something went wrong!' + (e as Error).message,
        type: 'error',
        id: '132132123',
      });
      console.log('lo-edit::erro', e);
    } finally {
      setEditLoading(null);
    }
  };
  return { changeStrike };
};

export { useLimitOrderHandlers };
