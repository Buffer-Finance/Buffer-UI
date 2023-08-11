import { useCall2Data, useReadCall } from '@Utils/useReadCall';
import ReferralABI from '../Config/ReferralABI.json';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { getCallId, getReadId } from '@Utils/Contract/multiContract';

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
  return useCall2Data(calls, 'traderReferralCodes')?.data?.[
    getReadId(calls?.[0])
  ];
}
