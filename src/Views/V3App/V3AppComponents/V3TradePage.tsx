import { V3OptionBuying } from './V3optionBuying';
import { V3ActiveAsset } from './V3ActiveAsset';
import { V3MultiChart } from './V3Multichart';

export const V3AppTradePageComponent = () => {
  return (
    <main className="flex  w-[100vw]">
      <div className="flex flex-col flex-1 relative">
        <V3MultiChart />
      </div>
      <div className="w-[281px] flex flex-col  border-left  pr-2 ">
        <V3ActiveAsset />
        <V3OptionBuying />
      </div>
    </main>
  );
};
