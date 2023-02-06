import React, { useEffect } from "react";
import Background from "./style";
import { IconButton } from "@mui/material";
import CrossIcon from "src/SVG/buttons/cross";
import {
  initializeGraphModal,
  initializeTradingView,
} from "@Utils/appControls/initializeTradingView";
import { useGlobal } from "@Contexts/Global";
import { graph } from "@Views/BinaryOptions/store";
import { useAtom } from "jotai";
interface IGraphModal {
  isOption?: boolean;
}
//deploy
const GraphModal: React.FC<IGraphModal> = () => {
  const { state } = useGlobal();
  const [isGraphOpen, setIsGraphOpen] = useAtom(graph);

  useEffect(() => {
    if (!state.settings.activeChain || !isGraphOpen) return;
    initializeGraphModal(
      state.settings.activeAsset?.name || "BNB",
      // state.isDarkMode
      true
    );
  }, [state.settings.activeAsset, state.isDarkMode, isGraphOpen]);
  return (
    <Background className={isGraphOpen ? "active" : ""}>
      <IconButton
        className="icon-btn cross"
        onClick={() => {
          setIsGraphOpen(false);
        }}
      >
        <CrossIcon />
      </IconButton>
      <div id="graphmodal"></div>
    </Background>
  );
};

export default GraphModal;
