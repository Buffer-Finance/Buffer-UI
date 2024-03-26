import { toFixed } from '@Utils/NumString';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import { useActiveMarket } from '@Views/ABTradePage/Hooks/useActiveMarket';
import { useSpread } from '@Views/ABTradePage/Hooks/useSpread';
import { CurrentPrice } from '@Views/ABTradePage/Views/BuyTrade/ActiveTrades/CurrentPrice';
import { PlusMinus } from '@Views/ABTradePage/Views/MarketChart/MarketStatsBar';
import { AssetSelectorDD } from '@Views/ABTradePage/Views/Markets/AssetSelectorDD';

const MarketPicker: React.FC<{ payout: string | null }> = ({ payout }) => {
  const { activeMarket } = useActiveMarket();
  const { openMarketPickerShutter } = useShutterHandlers();
  const { data: allSpreads } = useSpread();

  if (!activeMarket) return <></>;
  const spread = allSpreads?.[activeMarket.tv_id]?.spread ?? 0;
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
      <div className="items-center flex gap-x-[6px]">
        <div className="text-[#C3C2D4] ml-2 text-f12 flex items-center">
          <CurrentPrice
            token0={activeMarket?.token0}
            token1={activeMarket?.token1}
          />
          <div className="flex items-center ml-1 text-[#808191]">
            <PlusMinus
              svgProps={{ fill: '#808191' }}
              className="scale-[65%] mt-1"
            />
            {toFixed(spread / 1e6, 4)}%
          </div>
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
