import { useContext } from "react";
import { useAccount, useContractReads } from "wagmi";
import { getContract } from "../Config/Address";
import { ReferralContext } from "../referralAtom";
import ReferralABI from "../Config/ReferralABI.json";
import { useUserAccount } from "@Hooks/useUserAccount";

export const useAppliedReferral = () => {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ReferralContext);

  return useContractReads({
    contracts: [
      {
        address: getContract(activeChain.id, "referral"),
        abi: ReferralABI,
        functionName: "traderReferralCodes",
        args: [account],
        chainId: activeChain.id,
      },
    ],
  })?.data?.[0];
};
