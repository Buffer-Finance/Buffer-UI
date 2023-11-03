import { divide } from '@Utils/NumString/stringArithmatics';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { AssetSelectorDD } from '@Views/TradePage/Views/Markets/AssetSelectorDD';
import { getMaximumValue } from '@Views/TradePage/utils';
import { CurrentPrice } from '../MiddleSection/StatusBar/AssetSelector/CurrentPrice';
import { useShutterHandlers } from './Shutters';

const MarketPicker: React.FC<{
  activeMarket: InoLossMarket | undefined;
}> = ({ activeMarket }) => {
  const { openMarketPickerShutter } = useShutterHandlers();

  if (!activeMarket) return <></>;
  const payout = getMaximumValue(
    divide(activeMarket.payoutForDown, 16) as string,
    divide(activeMarket.payoutForUp, 16) as string
  );
  return (
    <div
      className="w-full flex justify-between  items-center my-3 p-[3px] bg-[#282B39] rounded-[5px] "
      role="button"
      onClick={openMarketPickerShutter}
    >
      <button
        type="button"
        className="flex w-fit text-f14 items-center   px-3  "
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          openMarketPickerShutter();
        }}
      >
        <div className="w-[18px] h-[18px] mr-2 ">
          <PairTokenImage pair={activeMarket.chartData} />
        </div>
        {activeMarket.chartData.pair}
      </button>
      <div className="items-center flex gap-x-[6px]">
        <div className="ml-2 text-f12">
          <CurrentPrice market={activeMarket} className="text-[#C3C2D4]" />
        </div>
        <div className="bg-blue w-fit px-[6px] text-f13 text-1 h-full rounded-[4px] pt-[2px] pb-[1px]">
          {payout || '-'}%
        </div>
      </div>
    </div>
  );
};

const MobileMarketPicker = () => {
  return <AssetSelectorDD isMobile />;
};
export { MarketPicker, MobileMarketPicker };
