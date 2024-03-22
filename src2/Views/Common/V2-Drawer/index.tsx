import { useAtom } from "jotai";
import { isDrawerOpen } from "src/globalStore";
import WalletConnection from "../ConnectionDrawer";
import HorizontalTransition from "../Transitions/Horizontal";

interface IDrawer {
  children: React.ReactChild;
  open?: boolean;
  className?: string;
  childClass?: string;
}
const Drawer: React.FC<IDrawer> = ({
  children,
  className,
  childClass,
  open = true,
}) => {
  const [isConnectionDrawerOpen] = useAtom(isDrawerOpen);

  if (open || isConnectionDrawerOpen)
    return (
      <div
        className={`portal-drawer drawer hide-drawer tb:w-[40rem] tab:hidden ${className}`}
        id="drawer"
      >
        <div className={`drawer-child ${childClass}`}>
          <HorizontalTransition
            value={isConnectionDrawerOpen ? 1 : 0}
            className={childClass}
          >
            <div className={childClass}>{children}</div>
            <WalletConnection className={"open"} />
          </HorizontalTransition>
        </div>
      </div>
    );
  else return <></>;
};

export default Drawer;
