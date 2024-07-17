import InfoIcon from '@SVG/Elements/InfoIcon';
import { TradeType } from '@Views/ABTradePage/type';

const TradeData: React.FC<{ trade: TradeType }> = ({ trade }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        window.open(
          `https://api-v2.6.buffer.finance/trades/${trade.router}/${
            trade.queue_id
          }/?environment=42161&product_id=${
            trade.router.toLowerCase() ==
            '0x94582981c3be6092b912265C2d2cE172e7f9c3B1'.toLowerCase()
              ? 'xyz'
              : 'abc'
          }`,
          '_blank'
        );
      }}
    >
      <InfoIcon tooltip="Open trade as JSON" sm />
    </button>
  );
};

export { TradeData };
