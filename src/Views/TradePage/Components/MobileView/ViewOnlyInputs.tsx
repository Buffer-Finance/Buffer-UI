import MemoPlusIcon from '@SVG/Elements/PlusIcon';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { timeSelectorAtom, tradeSizeAtom } from '@Views/TradePage/atoms';
import { PlusOne } from '@mui/icons-material';
import { useAtomValue } from 'jotai';

const ViewOnlyInputs: React.FC<any> = ({}) => {
  const { openShutter } = useShutterHandlers();
  const amount = useAtomValue(tradeSizeAtom);
  const currentTime = useAtomValue(timeSelectorAtom);

  return (
    <div className="flex items-center gap-x-3">
      <div className="flex w-[95%] bg-[#282B39] items-center rounded-[5px]">
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
      <button
        onClick={openShutter}
        className="border-box mr-2 py-[6px] min-h-full w-full flex items-center justify-between  bg-[#282B39] rounded-[5px]"
      >
        <div className="ml-3 text-f16 font-bold bg-[#232334] w-[29px] h-[29px] rounded-full text-center grid place-items-center">
          <span>+</span>
        </div>
        <span className="text-1 text-f12">
          {currentTime.HHMM.split(':')[0]} h {currentTime.HHMM.split(':')[1]}{' '}
          min
        </span>
        <div className="mr-3 text-f16 font-bold bg-[#232334] w-[29px] h-[29px] rounded-full text-center grid place-items-center">
          <span>-</span>
        </div>
      </button>
    </div>
  );
};

export { ViewOnlyInputs };
