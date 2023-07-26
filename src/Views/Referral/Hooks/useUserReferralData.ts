import { useReadCall } from '@Utils/useReadCall';
import ReferralABI from '../Config/ReferralABI.json';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';

export function useRefereeCode() {
  const { address: account } = useUserAccount();
  const { activeChain } = useActiveChain();
  const configContracts = getConfig(activeChain.id);
  const referralAddress = configContracts.referral_storage;

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
