import { Button } from "@mui/material";
import { useAtom } from "jotai";
import { BetType, dates, graph } from "@Views/BinaryOptions/store";
import GraphModal from "@Views/BinaryOptions/OrderBookComponents/GraphModal";
import { BuyOptionsStyles } from "@Views/BinaryOptions/style";
import AssetInfo from "@Views/Common/AssetInfo";
import ToggleButton from "@Views/Common/BufferToggleButton";
import { DateDropdown } from "@Views/BinaryOptions/PGDrawer/DateDropdown";
import PGTable from "@Views/BinaryOptions/Tables/OrderBookTable";

const BuyOptions = () => {
  const [isyes, setIsyes] = useAtom(BetType);
  const [, setIsGraphOpen] = useAtom(graph);
  const [dateList] = useAtom(dates);
  return (
    <BuyOptionsStyles>
      <GraphModal />
      <AssetInfo />
      <ToggleButton
        value={isyes}
        onChange={() => setIsyes(!isyes)}
        className="mmt"
      />
      <div className="flex-bw xmmt">
        <DateDropdown dateList={dateList} />
        <Button
          onClick={() => {
            setIsGraphOpen(true);
          }}
          className="chartButton font3 weight-600 s"
        >
          {/* <ChartIcon className="txmr" /> */}
          Chart
        </Button>
      </div>
      <div className="xmmt">
        <PGTable shoundShowMobile={true} className="" />
      </div>
    </BuyOptionsStyles>
  );
};

export default BuyOptions;
