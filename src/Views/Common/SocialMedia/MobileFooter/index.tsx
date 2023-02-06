import React from "react";
import Style from "./style";
import AccountInfo from "@Views/Common/AccountInfo";
import NavbarDropdown from "@Views/Common/Dropdown";

import { useGlobal } from "@Contexts/Global";
import { useAccount } from "wagmi";
import { useUserAccount } from "@Hooks/useUserAccount";

interface IMobileFooterProps {}

const MobileFooter: React.FunctionComponent<IMobileFooterProps> = (props) => {
  const { address: account } = useUserAccount();
  const { state } = useGlobal();
  return (
    <Style>
      {account &&
        state.settings.activeChain &&
        state.settings.activeChain.name.toUpperCase() !== "AURORA" && (
          <AccountInfo />
        )}
      <NavbarDropdown />
    </Style>
  );
};

export default MobileFooter;
