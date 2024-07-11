import InfoIcon from '@SVG/Elements/InfoIcon';
import { TradeType } from '@Views/ABTradePage/type';

const TradeData: React.FC<{ trade: TradeType }> = ({ trade }) => {
  return (
    <button
      onClick={() =>
        window.open(
          `https://api-v2.6.buffer.finance/trades/${trade.router}/${trade.queue_id}/?environment=42161`,
          '_blank'
        )
      }
    >
      <InfoIcon tooltip="Get the full trade information." sm />
    </button>
  );
};

export { TradeData };
