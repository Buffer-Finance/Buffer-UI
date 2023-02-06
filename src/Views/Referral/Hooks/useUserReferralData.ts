import { Chain, useAccount, useContractReads } from "wagmi";
import getDeepCopy from "@Utils/getDeepCopy";
import { convertBNtoString, useReadCall } from "@Utils/useReadCall";
import ReferralABI from "../Config/ReferralABI.json";
import { getContract } from "../Config/Address";
import axios from "axios";
import useSWR from "swr";
import { useUserAccount } from "@Hooks/useUserAccount";

export function useUserReferralData(activeChain: Chain) {
  const activeChainID = activeChain.id;
  const { address: account } = useUserAccount();
  const referralAddress = getContract(activeChain.id, "referral");

  const calls = referralAddress
    ? [
        {
          address: referralAddress,
          abi: ReferralABI,
          functionName: "traderReferralCodes",
          args: [account],
          chainId: activeChainID,
        },
      ]
    : [];

  const { data } = useContractReads({
    contracts: calls,
    watch: true,
  });

  let response = {
    referreeRebate: null,
    referreeVolume: null,
    referreeCode: null,
    referrerTrades: null,
    referrerVolume: null,
    referrerDiscount: null,
  };

  if (data && data?.[0]) {
    const convertedData = getDeepCopy(data?.[0]);
    convertBNtoString(convertedData);
    response.referreeCode = convertedData;
  }
  return response;
}

export function useRefereeCode(activeChain: Chain) {
  const activeChainID = activeChain.id;
  const { address: account } = useUserAccount();
  const referralAddress = getContract(activeChain.id, "referral");

  const calls = referralAddress
    ? [
        {
          address: referralAddress,
          abi: ReferralABI,
          name: "traderReferralCodes",
          params: [account],
        },
      ]
    : [];
  return useReadCall({
    contracts: calls,
  });
}
