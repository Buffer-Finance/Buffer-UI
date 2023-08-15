import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { useAtomValue } from 'jotai';

const MobileDurationInput: React.FC<any> = ({}) => {
  const { openShutter } = useShutterHandlers();
  const amount = useAtomValue(tradeSizeAtom);

  return (
    <div className="flex gap-x-[10px]">
      <div className="flex w-full bg-[#282B39] rounded-[5px]">
        {' '}
        <button
          className={`w-full h-full text-left px-[10px] text-${
            amount ? '1' : '[#808191]'
          } text-f12`}
          onClick={openShutter}
        >
          {amount ? amount : ' Enter'}
        </button>
        <PoolDropdown />
      </div>
      <div className="w-full bg-red">
        {' '}
        <span>Enter</span>
      </div>
    </div>
  );
};

export { MobileDurationInput };
