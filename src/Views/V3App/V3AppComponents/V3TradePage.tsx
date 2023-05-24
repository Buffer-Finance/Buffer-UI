import { V3OptionBuying } from './V3optionBuying';
import { V3ActiveAsset } from './V3ActiveAsset';
import { V3MultiChart } from './V3Multichart';
import { useSwitchPoolForTrade } from '../Utils/useSwitchPoolForTrade';

export const V3AppTradePageComponent = () => {
  useSwitchPoolForTrade();
  return (
    <main className="flex  w-[100vw]">
      {/* <div className="relative w-full m-[10px] flex-1"> */}
      <V3MultiChart />
      {/* </div> */}
    </main>
  );
};
