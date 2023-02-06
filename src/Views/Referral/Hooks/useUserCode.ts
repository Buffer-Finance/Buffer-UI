import { Chain, useAccount, useContractReads } from "wagmi";
import getDeepCopy from "@Utils/getDeepCopy";
import { convertBNtoString } from "@Utils/useReadCall";
import ReferralABI from "../Config/ReferralABI.json";
import { getContract } from "../Config/Address";
import { useUserAccount } from "@Hooks/useUserAccount";

export function useUserCode(activeChain: Chain) {
  const activeChainID = activeChain.id;
  const { address: account } = useUserAccount();
  const referralAddress = getContract(activeChain.id, "referral");

  const calls = referralAddress
    ? [
        {
          address: referralAddress,
          abi: ReferralABI,
          functionName: "userCode",
          args: [account],
          chainId: activeChainID,
        },
      ]
    : [];

  const { data } = useContractReads({
    contracts: calls,
    watch: true,
  });

  let response = { affiliateCode: null };

  if (data && data?.[0]) {
    const convertedData = getDeepCopy(data);
    convertBNtoString(convertedData);
    response = { affiliateCode: convertedData[0] };
  }
  return response;
}
