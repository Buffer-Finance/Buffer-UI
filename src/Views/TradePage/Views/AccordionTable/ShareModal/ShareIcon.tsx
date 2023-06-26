import ShareIcon from '@Public/shareModal/ShareIcon';
import { SetShareBetAtom, SetShareStateAtom } from '@Views/TradePage/atoms';
import { TradeType, marketType, poolInfoType } from '@Views/TradePage/type';
import { useAtom } from 'jotai';

export const Share: React.FC<{
  data: TradeType;
  market: marketType;
  poolInfo: poolInfoType;
}> = ({ data, market, poolInfo }) => {
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setBet({
          trade: data,
          expiryPrice: data.expiry_price,
          market: market,
          poolInfo: poolInfo,
        });
        setIsOpen(true);
      }}
    >
      <ShareIcon />
    </button>
  );
};
