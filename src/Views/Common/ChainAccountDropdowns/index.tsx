import Background from "./style";
import BufferDropdown from "@Views/Common/BufferDropdown";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AccountConnectionDropdown from "@Views/Common/Dropdown";
import { changeRoute } from "@Utils/appControls/changeRoute";
import { ArrowDropDownRounded } from "@mui/icons-material";
import { useNetwork, Chain } from "wagmi";
import { getChains } from "src/Providers/wagmiClient";
import * as chain from "@wagmi/core/chains";
import { useMemo } from "react";

interface INavbar {
  className?: string;
}
export const chainImageMappipng = {
  [chain.polygon.name]:
    "https://cdn.buffer.finance/Buffer-Website-Data/main/chains/polygon2.png",
  [chain.polygonMumbai.name]:
    "https://cdn.buffer.finance/Buffer-Website-Data/main/chains/polygon2.png",
  [chain.arbitrum.name]: "/Chains/ARBITRIUM.png",
  [chain.arbitrumGoerli.name]: "/Chains/ARBITRIUM.png",
  ["BSC"]: "/Chains/BSC.png",
};

export const chainSymbolMapping = {
  [chain.polygon.name]: "POLYGON",
  [chain.polygonMumbai.name]: "POLYGON",
  [chain.arbitrum.name]: "ARBITRUM",
  [chain.arbitrumGoerli.name]: "ARBITRUM",
  ["BSC"]: "BSC",
};

export const useChains = () => {
  let tempChain = useMemo(()=>{
    return { activeChain:chain.arbitrum };
  },[])
  return tempChain;
};

const ChainAccountDropdowns: React.FC<INavbar> = ({ className }) => {
  const { activeChain } = useChains();
  const activeChainName = activeChain?.name;
  const chains = getChains();
  // const router = useRouter();
  const activeIndex = 1;
function switchChain(){
  // FIXME Multichain
}

  let disabled = false;
  if (typeof window !== "undefined") {
    if (window.location.href.includes("migrate")) {
      disabled = true;
    }
  }
  return (
    <Background>
      

        <AccountConnectionDropdown inDrawer />
    </Background>
  );
};

export default ChainAccountDropdowns;
