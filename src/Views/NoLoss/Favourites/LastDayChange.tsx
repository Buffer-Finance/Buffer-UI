import { useAtom } from "jotai";
import {
  get24hChange,
  market2dayChangeAtom,
  marketPriceAtom,
} from "src/TradingView/useDataFeed";
import { Stats } from "../Components/BinaryInfo";

export const LastDayChange = ({ currentAsset }) => {
  const [marketPrice] = useAtom(market2dayChangeAtom);
  const change24h = get24hChange(marketPrice, currentAsset);
  return (
    <div className="flex items-center">
      <Stats
        arrowStyles={"h-[20px] w-[12px] mt-2"}
        fontSize={"text-f13 mbn3"}
        info={change24h || 30}
      />
    </div>
  );
};
