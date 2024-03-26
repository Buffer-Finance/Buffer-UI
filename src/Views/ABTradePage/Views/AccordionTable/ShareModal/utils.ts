import {
  add,
  divide,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { TradeType } from '@Views/ABTradePage/type';
import { calculateOptionIV } from '@Views/ABTradePage/utils/calculateOptionIV';
import { calculatePnlForProbability } from '../../BuyTrade/ActiveTrades/TradeDataView';
import { getProbabilityByTime } from '../Common';

export const getPayout = (
  trade: TradeType,
  expiryPrice: number | null,
  decimals: number
) => {
  if (trade.state === 'OPENED' || trade.payout === null) {
    if (!expiryPrice) return { payout: '0', pnl: '0' };
    const [pnl, payout] = getPendingData(trade, expiryPrice, decimals);
    return { payout: payout as string, pnl: pnl as string };
  } else
    return {
      payout: trade.payout || '0',
      pnl: trade.payout
        ? (divide(subtract(trade.payout, trade.trade_size), decimals) as string)
        : subtract(
            '0',
            divide(trade.trade_size.toString(), decimals) as string
          ),
    };
};

export function getPendingData(
  currentRow: TradeType,
  expiryPrice: number,
  decimals: number
) {
  if (!currentRow && !expiryPrice) return ['0', '0'];
  let payout = currentRow.payout;
  let pnl = '0';
  if (payout) {
    pnl = subtract(payout, currentRow.trade_size);
  } else {
    if (!!currentRow.close_time) {
      //early close
      pnl = getEarlypnl(currentRow, expiryPrice, decimals);
      payout = add(multiply(pnl, decimals), currentRow.trade_size);
      console.log(`aug-payout-early: `, payout, pnl, currentRow.trade_size);
    } else {
      //end close
      pnl = getEndPnl(currentRow, expiryPrice, decimals);
      payout = add(multiply(pnl, decimals), currentRow.trade_size);
      console.log(`aug-payout-end: `, payout, pnl, currentRow.trade_size);
    }
  }

  return [pnl, payout];
}

function getEarlypnl(
  currentRow: TradeType,
  expiryPrice: number,
  decimals: number
) {
  console.log(`ec-aug-currentRow.close_time: `, currentRow.close_time);
  console.log(
    `ec-aug-currentRow.expiration_time: `,
    currentRow.expiration_time
  );
  const probability = getProbabilityByTime(
    currentRow,
    expiryPrice / 1e8,

    currentRow.close_time as number,
    currentRow.expiration_time as number,
    calculateOptionIV(
      currentRow.is_above ?? false,
      currentRow.strike / 1e8,
      expiryPrice / 1e8,
      currentRow.pool.IV,
      currentRow.pool.IVFactorITM,
      currentRow.pool.IVFactorOTM
    ) / 1e4
  );
  const { earlycloseAmount } = calculatePnlForProbability({
    decimals,
    probability,
    trade: currentRow,
  });
  return earlycloseAmount;
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

  return pnl;
}
