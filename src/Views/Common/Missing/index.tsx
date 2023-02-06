import { ReactNode, useEffect } from "react";
import { PrimaryActionBtn } from "../Buttons";
import Background from "./style";
import { removeClass, setOpacity } from "@Utils/appControls/removeMargin";
import { useGlobal } from "@Contexts/Global";
import Drawer from "../v2-Drawer";
import Link from "react-router";
import { defaultPair } from "@Views/BinaryOptions";

interface IMissing {
  children?: ReactNode;
  onClick: (e: any) => void;
  paddingTop?: string;
}

const Missing: React.FC<IMissing> = ({ children, onClick, paddingTop }) => {
  const { state } = useGlobal();
  useEffect(() => {
    console.log("Hola");

    if (!state.settings.isDrawerOpen) {
      setOpacity("dropdown-box", "1");
      removeClass("main-section", "active-drawer");
      removeClass("navbar", "active-drawer");
      // removeClass("footer", "active-drawer");
    }
  }, [state.settings.isDrawerOpen]);
  return (
    <>
      <main className="content-drawer">
        <Background paddingTop={paddingTop}>
          {state.isDarkMode ? (
            <img src="/404.png" className="missing-img" />
          ) : (
            <img src="/404light.png" className="missing-img" />
          )}
          <p className="text-f16 text-2 font-extrabold">Page Not Found</p>
          <span className="text text-6">{children}</span>
          <Link href={`/binary/${defaultPair}`}>
            <PrimaryActionBtn onClick={console.log}>Trade </PrimaryActionBtn>
          </Link>
        </Background>
      </main>
      {/* <ConnectionDrawer state={state.settings.isDrawerOpen} secondState={false}>
        <WalletConnection />
      </ConnectionDrawer> */}
      <Drawer open={false}>
        <></>
      </Drawer>
    </>
  );
};

export default Missing;
