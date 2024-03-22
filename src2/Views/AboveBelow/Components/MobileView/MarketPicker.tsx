import { selectedPoolActiveMarketAtom } from '@Views/AboveBelow/atoms';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import { MobileChartControlls } from '@Views/TradePage/Components/MobileView/MobileChartControlls';
import { useAtomValue } from 'jotai';
import { CurrentPrice } from '../StatusBar/AssetSelector/CurrentPrice';
import { useShutterHandlers } from './Shutters';
import { MobileAccordionTable } from './Shutters/MobileTable';

const MarketPicker: React.FC<{}> = () => {
  const { openMarketPickerShutter } = useShutterHandlers();
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  if (!activeMarket) return <></>;

  return (
    <div className="flex w-full items-center justify-between gap-x-[5px]">
      <div
        className="w-full flex justify-between  items-center my-3 p-[3px] bg-[#282B39] rounded-[5px] "
        role="button"
        onClick={openMarketPickerShutter}
      >
        <button
          type="button"
          className="flex w-fit text-f14 items-center pl-2"
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            openMarketPickerShutter();
          }}
        >
          <div className="w-[18px] h-[18px] mr-2 ">
            <PairTokenImage pair={activeMarket} />
          </div>
          {activeMarket.pair}
        </button>
        <div className="items-center flex gap-x-[6px]">
          <div className="ml-2 text-f12">
            <CurrentPrice
              market={activeMarket}
              className="text-[#C3C2D4] mr-2 mb-1"
            />
          </div>
          {/* <div className="bg-blue w-fit px-[6px] text-f13 text-1 h-full rounded-[4px] pt-[2px] pb-[1px]">
          {payout || '-'}%
        </div> */}
        </div>
      </div>
      <MobileChartControlls activeMarket={activeMarket.tv_id} />
    </div>
  );
};

const MobileMarketPicker = () => {
  return <MobileAccordionTable />;
};
export { MarketPicker, MobileMarketPicker };
