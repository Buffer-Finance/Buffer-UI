import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { Display } from '@Views/Common/Tooltips/Display';
import { BetState } from '@Views/NoLoss-V3/Hooks/useAheadTrades';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import { IGQLHistory } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';

export const Probability: React.FC<{
  trade: IGQLHistory;
}> = ({ trade }) => {
  const { price } = useMarketPrice(trade.chartData.tv_id);
  if (trade.state === BetState.queued) {
    return <>-</>;
  }
  if (trade.expirationTime === undefined) {
    return <>-</>;
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
      +trade.strike / 8,
      +trade.expirationTime - currentEpoch,
      0,
      12000 / 1e4
    ) * 100;

  return <Display data={probability} unit={'%'} precision={2} />;
};
