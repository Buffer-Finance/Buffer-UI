import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { useUserAccount } from "@Hooks/useUserAccount";
import { useCallback } from "react";
import { useAccount } from "wagmi";

const useWriteCallValidations = () => {
  const { state } = useGlobal();
  const { address: account } = useUserAccount();
  const toastify = useToast();
  const exitValidations = useCallback(() => {
    if (state.txnLoading === 2) {
      toastify({
        id: "2321123",
        type: "error",
        msg: "Please confirm your previous pending transactions.",
      });
      return true;
    }
    if (!account) {
      toastify({
        id: "2321123",
        type: "error",
        msg: "Please connect your wallet first.",
      });
      return true;
    }
  }, [state, account]);

  return [exitValidations];
};

export default useWriteCallValidations;
