import { subtract } from '@Utils/NumString/stringArithmatics';
import { OngoingTradeSchema } from '@Views/TradePage/type';

export const getPayout = (trade: OngoingTradeSchema, expiryPrice) => {
  if (trade.state === 'OPENED') {
    const [pnl, payout] = getPendingData(trade, expiryPrice);
    return { payout: payout as string, pnl: pnl as string };
  } else
    return {
      payout: trade?.payout || '0',
      pnl: trade?.payout
        ? trade.payout - trade.trade_size
        : subtract('0', trade.trade_size.toString()),
    };
};

export function getPendingData(
  currentRow: OngoingTradeSchema,
  expiryPrice: string
) {
  if (!currentRow && !expiryPrice) return ['0', '0'];
  let payout = currentRow.locked_amount + '';
  let pnl = '0';
  if (payout) {
    pnl = subtract(payout, currentRow.trade_size);
  }
  const currExpiryPrice = expiryPrice;
  if (currExpiryPrice) {
    if (currentRow.is_above) {
      if (currExpiryPrice > currentRow.strike) {
      } else {
        pnl = subtract('0', currentRow.trade_size + '');
        payout = '0';
      }
    } else {
      if (currExpiryPrice < currentRow.strike) {
      } else {
        pnl = subtract('0', currentRow.trade_size + '');
        payout = '0';
      }
    }
  }

  return [pnl, payout];
}
