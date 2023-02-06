import Background from "./style";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import VersionChip from "../VersionChip";
import NotificationCount from "src/SVG/Elements/NotificationCount";

export interface ITab {
  name: string;
  icon?: number | "v2";
}

interface IBufferTab {
  value: number;
  handleChange: (event: any, arg: number) => void;
  tablist: ITab[];
  activeTabColor?: string;
  moveY?: number;
  className?: string;
  indicatorColor?: string;
  distance?: number;
}

const BufferTab: React.FC<IBufferTab> = ({
  value,
  handleChange,
  tablist,
  activeTabColor,
  moveY,
  className,
  distance,
  indicatorColor,
}) => {
  let moveYProp = moveY;
  tablist.forEach((element) => {
    if (element.icon) {
      moveYProp += 4;
    }
  });
  return (
    <Background className={className}>
      <div className="tabs-root flex cursor-pointer">
        {tablist.map((singleTab: ITab, idx) => {
          return (
            <div
              key={singleTab.name}
              onClick={(e) => {
                handleChange(e, idx);
              }}
              className={`root-button ${value == idx && "selected-button"}`}
              // disableRipple
              // icon={
              //   singleTab.icon === "v2" ? (
              //     <VersionChip version={2} className="sml" />
              //   ) : singleTab.icon ? (
              //     <NotificationCount text={singleTab.icon} />
              //   ) : null
              // }
              // iconPosition="end"
              // label={singleTab.name}
            >
              {singleTab.name}
            </div>
          );
        })}
      </div>
      {/* <Tabs
        value={value}
        classes={{
          indicator: "indicator-style",
          root: "tabs-root",
        }}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        {tablist.map((singleTab: ITab, idx) => {
          return (
            <Tab
              key={singleTab.name}
              classes={{
                root: `${className} root-button`,
                selected: "selected-button",
              }}
              disableRipple
              icon={
                singleTab.icon === "v2" ? (
                  <VersionChip version={2} className="sml" />
                ) : singleTab.icon ? (
                  <NotificationCount text={singleTab.icon} />
                ) : null
              }
              iconPosition="end"
              label={singleTab.name}
            />
          );
        })}
      </Tabs> */}
    </Background>
  );
};

export default BufferTab;
