import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { TradeType } from '@Views/TradePage/type';
import { calculatePnlForProbability } from '../../BuyTrade/ActiveTrades/TradeDataView';
import { getProbabilityByTime } from '../Common';

export const getPayout = (
  trade: TradeType,
  expiryPrice: number,
  decimals: number
) => {
  if (trade.state === 'OPENED') {
    const [pnl, payout] = getPendingData(trade, expiryPrice, decimals);
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
  currentRow: TradeType,
  expiryPrice: number,
  decimals: number
) {
  if (!currentRow && !expiryPrice) return ['0', '0'];
  let payout = currentRow.payout;
  let pnl = 0;
  if (payout) {
    pnl = payout - currentRow.trade_size;
  } else {
    if (!!currentRow.close_time) {
      //early close
      pnl = getEarlypnl(currentRow, expiryPrice, decimals);
      payout = pnl + currentRow.trade_size;
    } else {
      //end close
      pnl = getEndPnl(currentRow, expiryPrice, decimals);
      payout = pnl + currentRow.trade_size;
    }
  }

  return [pnl, payout];
}

function getEarlypnl(
  currentRow: TradeType,
  expiryPrice: number,
  decimals: number
) {
  const probability = getProbabilityByTime(
    currentRow,
    expiryPrice / 1e8,

    currentRow.close_time as number,
    currentRow.expiration_time as number
  );
  const { earlycloseAmount } = calculatePnlForProbability({
    decimals,
    probability,
    trade: currentRow,
  });
  return Number(earlycloseAmount);
}

function getEndPnl(
  currentRow: TradeType,
  expiryPrice: number,
  decimals: number
) {
  let payout = divide(currentRow.locked_amount + '', decimals);
  const tradeSize = divide(currentRow.trade_size + '', decimals) as string;
  let pnl = '0';
  if (payout) {
    pnl = subtract(payout, tradeSize);
  }
  const currExpiryPrice = expiryPrice;
  if (currExpiryPrice) {
    if (currentRow.is_above) {
      if (currExpiryPrice > currentRow.strike) {
      } else {
        pnl = subtract('0', tradeSize);
        payout = '0';
      }
    } else {
      if (currExpiryPrice < currentRow.strike) {
      } else {
        pnl = subtract('0', tradeSize);
        payout = '0';
      }
    }
  }

  return Number(pnl);
}
