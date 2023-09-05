import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useRef } from 'react';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import DDArrow from '@SVG/Elements/Arrow';
import { MarketSelectorDD } from '@Views/TradePage/Views/MarketChart/MarketSelectorDD';
import { AssetSelectorDD } from '@Views/TradePage/Views/Markets/AssetSelectorDD';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';

const MarketPicker: React.FC<{ payout: string | null }> = ({ payout }) => {
  const { activeMarket } = useActiveMarket();
  const { openMarketPickerShutter } = useShutterHandlers();
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
          <PairTokenImage pair={activeMarket} />
        </div>
        {activeMarket?.pair}
      </button>

      <div className="bg-blue w-fit px-[6px] text-f13 text-1 h-full rounded-[4px] pt-[3px] pb-[1px]">
        {payout || '-'}%
      </div>
    </div>
  );
};

const MobileMarketPicker = () => {
  return <AssetSelectorDD isMobile />;
};
export { MarketPicker, MobileMarketPicker };
