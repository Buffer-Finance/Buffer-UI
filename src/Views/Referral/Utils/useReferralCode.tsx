import { useAtomValue } from "jotai";
import { referralCodeAtom } from "@Views/BinaryOptions";
import { Chain } from "wagmi";
import { useRefereeCode } from "../Hooks/useUserReferralData";

export const useReferralCode = (activeChain: Chain) => {
  // return ["hello", "hello", "hello"];
  const referrerInLocalStorage = useAtomValue(referralCodeAtom);
  const { data } = useRefereeCode(activeChain);
  return [
    data?.[0][0],
    referrerInLocalStorage,
    data?.[0][0] || referrerInLocalStorage || "",
  ];
};
