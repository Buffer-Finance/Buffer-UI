import useStopWatch from "@Hooks/Utilities/useStopWatch";
import { useAtomValue } from "jotai";
import { IconType, LeftBorderedDiv } from "@Views/Common/LeftBorderedDiv";
import { knowTillAtom } from "./Hooks/useIsMerketOpen";

interface IMarketTimingWarning {}

const MarketTimingWarning: React.FC<IMarketTimingWarning> = ({}) => {
  const knowTill = useAtomValue(knowTillAtom);

  const data = useStopWatch(knowTill.date / 1000);
  if (knowTill.date === null) return <></>;
  let type: IconType = "retry";
  if (!knowTill.open) {
    type = "timer";
  }
  return (
    <LeftBorderedDiv
      type={type}
      className={`text-f12 ${
        type == "retry"
          ? "text-[#C2C1D3] "
          : "text-[#E2CA18] bg-[rgba(226,202,24,0.05)]"
      }`}
    >
      <div className="text-[#C2C1D3] pr-[3px]">
        {!knowTill.date
          ? "Fetching Updated Market Status..."
          : knowTill.date == -1
          ? "Market is Closed for the day! Come back tomorrow."
          : knowTill.open
          ? `Market is Open Currently! Closing in ${data}`
          : `Market is Closed Currently! Opening in ${data}`}
      </div>
    </LeftBorderedDiv>
  );
};

export { MarketTimingWarning };
