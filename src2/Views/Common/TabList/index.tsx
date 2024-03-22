import { useGlobal } from "@Contexts/Global";
import { ReactNode } from "react";
import Background from "./style";

interface ITabList {
  tabs: string[];
  activeTab: string;
  setActiveTab?: (a: string) => void;
  className?: string;
  noRedirect?:boolean;
}
const TabList: React.FC<ITabList> = ({
  tabs,
  className,
  activeTab,
  noRedirect,
  setActiveTab,
}) => {
  const { dispatch, state } = useGlobal();

  const handleChange = (tab: string) => {
    dispatch({
      type: "SET_ACIVE_TAB",
      payload: tab,
    });
  };

  return (
    <Background className={className}>
      {tabs.map((child, idx) => (
        <div
          key={idx}
          className={`toggle-tab nowrap ${child === activeTab && "active"}`}
          onClick={() =>
            setActiveTab ? setActiveTab(child) : handleChange(child)
          }
        >
          {child}
        </div>
      ))}
    </Background>
  );
};

export default TabList;
