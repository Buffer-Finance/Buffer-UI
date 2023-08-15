import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { useAtomValue } from 'jotai';

const MobileDurationInput: React.FC<any> = ({}) => {
  const amount = useAtomValue(tradeSizeAtom);

  return <div className="flex h-[80px] gap-x-[10px]">Enter the duration</div>;
};

export { MobileDurationInput };
