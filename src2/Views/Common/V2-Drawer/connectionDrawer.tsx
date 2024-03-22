import { CSSTransition } from "react-transition-group";
import { isDrawerOpen } from "src/globalStore";
import { useAtom } from "jotai";
import { useEffect } from "react";
import Background from "../ConnectionDrawer/style";
import { IconButton } from "@mui/material";
import BackIcon from "src/SVG/buttons/back";
import { supportedWallets } from "config";
import { useWalletConnect } from "../ConnectionDrawer";
const addClass = (selector: string, className: string) => {
  const ele: HTMLDivElement = document.querySelector('#' + selector)
  ele?.classList?.add(className)
}
export function defaultClosed() {
  addClass("drawer", "drawer");
  addClass("drawer", "hide-drawer");
  // addClass("overlay", "tab");
  // addClass("overlay", "tab");
}
export function defaultConnectionClosed() {
  addClass("connection-drawer", "drawer");
  addClass("connection-drawer", "hide-drawer");
}
interface IDrawer {
  className: string;
}

const ConnectionDrawer: React.FC<IDrawer> = ({ className }) => {
  const [isConnectionDrawerOpen] = useAtom(isDrawerOpen);
  const { connectHandler, closeDrawer } = useWalletConnect();

  useEffect(() => defaultConnectionClosed(), []);
  return (
    <>
      {isConnectionDrawerOpen && (
        <div
          id="overlay"
          role={"button"}
          onClick={closeDrawer}
          className="web:hidden"
        ></div>
      )}
      <CSSTransition
        in={isConnectionDrawerOpen}
        timeout={200}
        classNames={"portal-connection-drawer-"}
        unmountOnExit
      >
        <>
          <div className="portal-connection-drawer web:hidden">
            <Background className={`${className} relative h-full`}>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex header">
                    <IconButton onClick={closeDrawer} className="button sxxmr">
                      <BackIcon />
                    </IconButton>
                    <span className="sml head-size capitalize text-1">
                      Connect Your Wallet
                    </span>
                  </div>
                  {supportedWallets.map((wallet: any, index: number) => (
                    <button
                      className={
                        "wallet bg-1 hover:brightness-125 transition-all duration-300"
                      }
                      key={index}
                      onClick={() => connectHandler(wallet.connectorId)}
                    >
                      <span className={"label"}>{wallet.name}</span>
                      <img
                        src={`/wallets/${wallet.img}.svg`}
                        alt="img"
                        className={`wallet_img`}
                      ></img>
                    </button>
                  ))}
                  <div className="msg-text">
                    Haven’t installed Metamask yet?&nbsp;
                    <a
                      className="metamask-link"
                      href="https://metamask.io/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Click Here
                    </a>
                  </div>
                </div>
                {/* <TryTestnetBanner /> */}
              </div>
            </Background>
          </div>
        </>
      </CSSTransition>
    </>
  );
};

export default ConnectionDrawer;
