import { useAtom } from "jotai";
import ToggleButton from "@Views/Common/BufferToggleButton";
import AssetDropDown from "@Views/Common/v2-AssetDropDown";
import { verticalTab } from "@Views/Common/VerticalTabs";
import PGTable from "../Tables/OrderBookTable";
import { BetType, dates } from "../store";
import { Background } from "./style";
import { ActiveAsset } from "./ActiveAsset";
import { CustomOption } from "./CustomOption";
import { DateDropdown } from "./DateDropdown";

export const DrawerChild = () => {
  const [dateList] = useAtom(dates);
  const [activeVerticalTab] = useAtom(verticalTab);
  const [isyes, setIsyes] = useAtom(BetType);
  return (
    <Background>
      <div>
        {activeVerticalTab !== 0 ? (
          <AssetDropDown isDropdown />
        ) : (
          <ActiveAsset />
        )}
      </div>
      {activeVerticalTab !== 0 ? (
        <div className="!tab:hidden">
          <div className="flex-bw xxxsmt">
            <ToggleButton
              onChange={() => {
                setIsyes(!isyes);
              }}
              value={isyes}
            />
            <DateDropdown dateList={dateList} />
          </div>

          <div className="xxxsmt">
            <PGTable shoundShowMobile={false} className="" />
          </div>
        </div>
      ) : (
        <CustomOption />
      )}

      {/** Mobile Drawer */}
      {/* {window.innerWidth < 600 && <MobileDrawer />} */}
    </Background>
  );
};
