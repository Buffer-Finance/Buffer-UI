import { binaryTabs } from "config";
import { useGlobal } from "@Contexts/Global";
import BufferTab from "@Views/Common/BufferTab";

export function Navbar({ className }: { className?: string }) {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  let isWeb = true;
  if (typeof window !== "undefined") {
    if (window.innerWidth < 1200) {
      isWeb = false;
    }
  }

  const tabs = isWeb ? binaryTabs.slice(1) : binaryTabs;
  let foundIdx = 0;
  for (let tab of tabs) {
    if (tab === activeTab) break;
    foundIdx++;
  }
  return (
    <BufferTab
      value={foundIdx}
      className={` ${className}`}
      handleChange={(e, t) => {
        if (isWeb) {
          t = t + 1;
        }
        dispatch({
          type: "SET_ACIVE_TAB",
          payload: binaryTabs[t],
        });
      }}
      distance={5}
      tablist={tabs.map((s) => ({ name: s }))}
    />
  );
}
