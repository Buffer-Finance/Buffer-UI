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

const MarketPicker: React.FC<any> = ({}) => {
  const { activeMarket } = useActiveMarket();
  const { openMarketPickerShutter } = useShutterHandlers();
  return (
    <button
      type="button"
      className="flex w-fit text-f14 items-center  !bg-[#282B39] rounded-[5px] px-3 py-2 my-3"
      onClick={openMarketPickerShutter}
    >
      <div className="w-[18px] h-[18px] mr-2 ">
        <PairTokenImage pair={activeMarket} />
      </div>
      {activeMarket?.pair}
      <div className="ml-4 bg-[#232334] w-[23px] h-[23px] rounded-[4px] grid place-items-center">
        <DDArrow
          className={` transition-all duration-300  ease-out scale-125 `}
        />
      </div>{' '}
    </button>
  );
};

const MobileMarketPicker = () => {
  return <AssetSelectorDD isMobile />;
};
export { MarketPicker, MobileMarketPicker };
