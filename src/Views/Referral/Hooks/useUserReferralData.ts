import { useReadCall } from '@Utils/useReadCall';
import ReferralABI from '../Config/ReferralABI.json';
import { getContract } from '../Config/Address';
import { useUserAccount } from '@Hooks/useUserAccount';

export function useRefereeCode() {
  const { address: account } = useUserAccount();
  const referralAddress = getContract();

  const calls =
    referralAddress && account
      ? [
          {
            address: referralAddress,
            abi: ReferralABI,
            name: 'traderReferralCodes',
            params: [account],
          },
        ]
      : [];
  return useReadCall({
    contracts: calls,
    swrKey: 'traderReferralCodes',
  });
}
