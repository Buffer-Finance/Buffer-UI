import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { BetState } from '@Views/AboveBelow/Hooks/useAheadTrades';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { Display } from '@Views/Common/Tooltips/Display';

export const Probability: React.FC<{
  trade: IGQLHistory;
  className?: string;
  isColored?: boolean;
}> = ({ trade, className = '', isColored = false }) => {
  const { price } = useMarketPrice(trade.market.tv_id);
  if (trade.state === BetState.queued) {
    return <>-</>;
  }
  if (trade.expirationTime === undefined) {
    return <>-</>;
  }
  if (price === undefined) {
    return <>No Price</>;
  }
  const currentEpoch = Math.round(new Date().getTime() / 1000);
  if (currentEpoch > +trade.expirationTime) {
    return <>processing...</>;
  }

  const probability =
    BlackScholes(
      true,
      trade.isAbove,
      price,
      +trade.strike / 1e8,
      +trade.expirationTime - currentEpoch,
      0,
      12000 / 1e4
    ) * 100;

  return (
    <Display
      data={probability}
      unit={'%'}
      precision={2}
      className={
        className +
        ' ' +
        (isColored ? (probability > 50 ? 'text-green' : 'text-red') : '')
      }
    />
  );
};
