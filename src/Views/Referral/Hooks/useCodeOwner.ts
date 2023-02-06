import { useContext, useEffect, useState } from "react";
import ReferralABI from "@Views/Referral/Config/ReferralABI.json";
import useDebouncedEffect from "@Hooks/Utilities/useDeboncedEffect";
import { useContract, useProvider } from "wagmi";
import { ReferralContext } from "@Views/Referral/referralAtom";
import { contractRead } from "@Utils/useReadCall";
import { getContract } from "../Config/Address";

export function useCodeOwner(code: string) {
  const [owner, setOwner] = useState(null);
  const { activeChain } = useContext(ReferralContext);
  const provider = useProvider({ chainId: activeChain.id });

  const referralContract = useContract({
    address: getContract(activeChain.id, "referral"),
    abi: ReferralABI,
    signerOrProvider: provider,
  });

  const updateOwner = async () => {
    if (!code) return;
    const tempOwner = await contractRead(referralContract, "codeOwner", [code]);
    setOwner(tempOwner);
  };
  useDebouncedEffect(
    () => {
      updateOwner();
    },
    300,
    [code]
  );
  // const updateOwnerDebounced = throttle(updateOwner, 500);
  useEffect(() => {
    setOwner(null);
  }, [code]);
  return owner;
}
