import { useGlobal } from "@Contexts/Global";
import { PrimaryActionBtn } from "@Views/Common/Buttons";
import Background from "./style";
import useOpenConnectionDrawer from "@Hooks/Utilities/useOpenConnectionDrawer";
import NoMatchFound from "src/SVG/Elements/NoMatchFound";
import { useAccount } from "wagmi";
import { useUserAccount } from "@Hooks/useUserAccount";
import {  useConnectModal} from '@rainbow-me/rainbowkit'

interface ITableErrorMsg {
  msg: string;
  onClick: (e: any) => void;
  btn?: string;
  shouldShowWalletMsg?: boolean;
}

const TableErrorMsg: React.FC<ITableErrorMsg> = ({
  msg,
  onClick,
  btn,
  shouldShowWalletMsg = true,
}) => {
  const { openConnectModal } = useConnectModal();

  const { address: account } = useUserAccount();
  const { dispatch } = useGlobal();
  const { openWalletDrawer } = useOpenConnectionDrawer();
  const connect = (e: any) => {
    dispatch({ type: "SET_DRAWER", payload: true });
    openWalletDrawer();
  };
  const errorMsg =
    shouldShowWalletMsg && !account ? "Wallet isn't connected" : msg;
  return (
    <Background className="mt-5">
      <NoMatchFound />
      {errorMsg}
      {btn && (
        <PrimaryActionBtn
          className={"button"}
          onClick={account ? onClick : openConnectModal}
        >
          {account ? btn : "Connect Wallet"}
        </PrimaryActionBtn>
      )}
    </Background>
  );
};

export default TableErrorMsg;
