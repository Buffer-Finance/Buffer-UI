import { toFixed } from '@Utils/NumString';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { CurrentPrice } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/CurrentPrice';
import { PlusMinus } from '@Views/TradePage/Views/MarketChart/MarketStatsBar';
import { AssetSelectorDD } from '@Views/TradePage/Views/Markets/AssetSelectorDD';
import { getMaxSpread } from '@Views/TradePage/utils/getSafeStrike';

const MarketPicker: React.FC<{ payout: string | null }> = ({ payout }) => {
  const { activeMarket } = useActiveMarket();
  const { openMarketPickerShutter } = useShutterHandlers();
  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const { poolDetails, switchPool } = useSwitchPool();

  if (!activeMarket || !switchPool) return <></>;
  const spread =
    (currentPrice *
      getMaxSpread(
        switchPool.SpreadConfig1,
        switchPool.SpreadConfig2,
        switchPool.SpreadFactor,
        switchPool.IV
      )) /
    1e8;
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
            {toFixed(spread, precision)}
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
