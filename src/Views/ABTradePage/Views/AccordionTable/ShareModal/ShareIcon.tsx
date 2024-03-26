import ShareIcon from '@Public/shareModal/ShareIcon';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { SetShareBetAtom, SetShareStateAtom } from '@Views/ABTradePage/atoms';
import { TradeType, marketType, poolInfoType } from '@Views/ABTradePage/type';
import { useAtom } from 'jotai';
import { useMedia } from 'react-use';

export const Share: React.FC<{
  data: TradeType;
  market: marketType;
  poolInfo: poolInfoType;
  iconBgColor?: string;
  className?: string;
}> = ({ data, market, poolInfo, iconBgColor, className = '' }) => {
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const isMobile = useMedia('(max-width:600px)');
  const { openShareShutter } = useShutterHandlers();
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
        if (isMobile) {
          openShareShutter();
        } else setIsOpen(true);
      }}
    >
      <ShareIcon bgColor={iconBgColor} className={className} />
    </button>
  );
};
